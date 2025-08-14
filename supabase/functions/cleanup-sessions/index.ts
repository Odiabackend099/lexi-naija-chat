import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting session cleanup...')
    
    // Call the cleanup function
    const { data: deletedCount, error } = await supabase.rpc('cleanup_expired_sessions')
    
    if (error) {
      console.error('Error during cleanup:', error)
      throw error
    }
    
    console.log(`Cleaned up ${deletedCount} expired sessions`)
    
    // Log the cleanup event
    await supabase.from('security_audit').insert({
      phone: 'system',
      event_type: 'session_cleanup_completed',
      event_data: { deleted_count: deletedCount },
      ip_address: 'system',
      user_agent: 'cleanup-function'
    })
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        deleted_count: deletedCount,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Cleanup function error:', error)
    
    // Log the error
    await supabase.from('security_audit').insert({
      phone: 'system',
      event_type: 'session_cleanup_error',
      event_data: { error: error.message },
      ip_address: 'system',
      user_agent: 'cleanup-function'
    })
    
    return new Response(
      JSON.stringify({ error: 'cleanup_failed', message: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})