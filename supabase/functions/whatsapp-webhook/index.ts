import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Environment variables
const TWILIO_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN') 
const TWILIO_FROM = Deno.env.get('TWILIO_WHATSAPP_FROM')
const PIN_SALT = Deno.env.get('PIN_SALT') || 'lexipay_salt'
const FLW_SECRET = Deno.env.get('FLUTTERWAVE_SECRET_KEY')

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper functions
async function createHmac(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(PIN_SALT),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function parseAmount(txt: string = ''): number | null {
  // Support: 5k, 5,000, 5000, ₦5000, 5k naira
  const k = /(\d+)\s*k\b/i
  const m = txt.match(k)
  if (m) return parseInt(m[1], 10) * 1000

  const num = txt.replace(/,/g, '').match(/(\d{3,})/)
  return num ? parseInt(num[1], 10) : null
}

function parseTransferCommand(body: string = '') {
  // e.g. "send 5000 to 0123456789" or "transfer 5k to 0123456789"
  const acct = body.match(/\b(\d{10})\b/)
  const amt = parseAmount(body)
  if (/send|transfer/i.test(body) && acct && amt) {
    return { amount: amt, account: acct[1] }
  }
  return null
}

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

async function getSession(phone: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('phone', phone)
    .maybeSingle()
    
  if (error) throw error
  
  if (data) return data
  
  const newSession = { 
    phone, 
    step: 'start', 
    tmp: {},
    updated_at: new Date().toISOString()
  }
  
  const { data: inserted, error: insertError } = await supabase
    .from('sessions')
    .insert(newSession)
    .select('*')
    .single()
    
  if (insertError) throw insertError
  return inserted
}

async function saveSession(phone: string, patch: any) {
  patch.updated_at = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('sessions')
    .upsert({ phone, ...patch })
    .select('*')
    .single()
    
  if (error) throw error
  return data
}

async function createFlutterwaveLink(amount: number, phone: string, meta: any) {
  const payload = {
    tx_ref: `tx-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    amount,
    currency: 'NGN',
    redirect_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-success`,
    customer: { 
      phonenumber: phone.replace('whatsapp:', '') 
    },
    meta
  }
  
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FLW_SECRET}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  
  const json = await response.json().catch(() => ({}))
  return { 
    link: json?.data?.link || '', 
    tx_ref: payload.tx_ref, 
    raw: json 
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
    const formData = await req.formData()
    const from = formData.get('From') as string || ''
    const text = (formData.get('Body') as string || '').trim()

    console.log('WhatsApp message received:', { from, text })

    const session = await getSession(from)

    const reply = async (msg: string) => {
      console.log('Sending reply:', { to: from, message: msg })
      await sendWhatsApp(from, msg)
    }

    if (session.step === 'start') {
      await saveSession(from, { step: 'ask_email', tmp: {} })
      await reply('Welcome to LexiPay AI (by ODIA.dev). Please reply with your email to continue.')
      return new Response('OK', { status: 200, headers: corsHeaders })
    }

    if (session.step === 'ask_email') {
      const email = text.includes('@') ? text : null
      if (!email) {
        await reply('That email looks invalid. Please send a valid email (e.g., name@example.com).')
        return new Response('OK', { status: 200, headers: corsHeaders })
      }
      await saveSession(from, { step: 'set_pin', email })
      await reply('Great. Now set a 4-digit PIN (e.g., 1234). You\'ll use this to confirm transfers.')
      return new Response('OK', { status: 200, headers: corsHeaders })
    }

    if (session.step === 'set_pin') {
      const pin = text.replace(/\D/g, '')
      if (!/^\d{4}$/.test(pin)) {
        await reply('PIN must be 4 digits. Try again.')
        return new Response('OK', { status: 200, headers: corsHeaders })
      }
      const pinHash = await createHmac(pin)
      await saveSession(from, { step: 'ready', pin_hash: pinHash, tmp: {} })
      await reply('Setup done ✅\nTry: "send 5000 to 0123456789"')
      return new Response('OK', { status: 200, headers: corsHeaders })
    }

    if (session.step === 'ready') {
      const transfer = parseTransferCommand(text)
      if (transfer) {
        await saveSession(from, { step: 'confirm_pin', tmp: transfer })
        await reply(`Confirm transfer of ₦${transfer.amount.toLocaleString()} to ${transfer.account}.\nEnter your 4-digit PIN to approve.`)
        return new Response('OK', { status: 200, headers: corsHeaders })
      }
      await reply('Try a command like: "send 5000 to 0123456789"')
      return new Response('OK', { status: 200, headers: corsHeaders })
    }

    if (session.step === 'confirm_pin') {
      const pin = text.replace(/\D/g, '')
      const pinHash = await createHmac(pin)
      
      if (pinHash !== session.pin_hash) {
        await reply('❌ PIN incorrect. Try again.')
        return new Response('OK', { status: 200, headers: corsHeaders })
      }
      
      const { amount, account } = session.tmp || {}
      const payment = await createFlutterwaveLink(amount, from, { account, phone: from })
      await saveSession(from, { 
        step: 'await_payment', 
        tmp: { ...session.tmp, tx_ref: payment.tx_ref } 
      })

      if (payment.link) {
        await reply(`Approve this payment to complete your transfer:\n${payment.link}`)
      } else {
        await reply('Could not create payment link at the moment. Please try again in a bit.')
      }
      return new Response('OK', { status: 200, headers: corsHeaders })
    }

    if (session.step === 'await_payment') {
      await reply('Your payment link has already been sent. Once payment succeeds, we\'ll confirm here ✅')
      return new Response('OK', { status: 200, headers: corsHeaders })
    }

    // Fallback
    await saveSession(from, { step: 'start', tmp: {} })
    await reply('Say "hi" to begin.')
    return new Response('OK', { status: 200, headers: corsHeaders })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'server_error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})