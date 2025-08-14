import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TWILIO_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_FROM = Deno.env.get('TWILIO_WHATSAPP_FROM')
const FLW_HASH = Deno.env.get('FLUTTERWAVE_WEBHOOK_HASH') || ''

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function sendWhatsApp(to: string, body: string) {
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) {
    throw new Error('Twilio credentials not configured')
  }

  const auth = btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)
  
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: to,
      From: TWILIO_FROM,
      Body: body,
    }),
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twilio API error: ${error}`)
  }
  
  return response.json()
}

// Security audit logging for webhook events
async function logWebhookEvent(eventType: string, eventData: any, req: Request) {
  try {
    await supabase.from('security_audit').insert({
      phone: eventData.phone || 'webhook',
      event_type: eventType,
      event_data: eventData,
      ip_address: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown'
    })
  } catch (error) {
    console.error('Failed to log webhook event:', error)
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'method_not_allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    // Verify Flutterwave signature if hash is configured
    const signature = req.headers.get('verif-hash') || req.headers.get('verif_hash')
    if (FLW_HASH && signature !== FLW_HASH) {
      await logWebhookEvent('webhook_signature_invalid', { signature }, req)
      return new Response(
        JSON.stringify({ error: 'invalid_signature' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const event = await req.json()
    console.log('Flutterwave webhook received:', event)

    // Log all webhook events for audit
    await logWebhookEvent('flutterwave_webhook_received', { 
      event: event.event, 
      status: event?.data?.status,
      amount: event?.data?.amount,
      tx_ref: event?.data?.tx_ref 
    }, req)

    // Handle successful payment
    if (event?.event === 'charge.completed' && event?.data?.status === 'successful') {
      const phone = event?.data?.customer?.phonenumber
      const account = event?.data?.meta?.account || 'the destination account'
      const amount = event?.data?.amount
      const tx_ref = event?.data?.tx_ref

      if (phone) {
        const to = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`
        const message = `Payment received ✅\n₦${Number(amount).toLocaleString()} approved.\nTransfer to ${account} confirmed.`
        
        try {
          await sendWhatsApp(to, message)
          console.log('WhatsApp notification sent successfully')
          
          // Update session back to ready state
          await supabase
            .from('sessions')
            .update({ step: 'ready', tmp: {}, updated_at: new Date().toISOString() })
            .eq('phone', to)

          await logWebhookEvent('payment_success_notification_sent', {
            phone: to,
            amount,
            account,
            tx_ref
          }, req)
        } catch (error) {
          console.error('Failed to send WhatsApp notification:', error)
          await logWebhookEvent('payment_notification_failed', {
            phone: to,
            amount,
            account,
            tx_ref,
            error: error.message
          }, req)
        }
      } else {
        console.error('No phone number found in payment data')
        await logWebhookEvent('payment_success_no_phone', {
          amount,
          account,
          tx_ref
        }, req)
      }
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Flutterwave webhook error:', error)
    await logWebhookEvent('webhook_error', { error: error.message }, req)
    
    return new Response(
      JSON.stringify({ error: 'server_error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})