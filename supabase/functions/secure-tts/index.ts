import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TTSRequest {
  text: string;
  voice?: string;
  sessionId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    const requestIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get JWT token for user identification (optional for anonymous users)
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) {
          userId = user.id;
        }
      } catch (e) {
        console.log('Auth token validation failed (allowing anonymous):', e);
      }
    }

    // Robust body parsing to avoid JSON parse failures
    let text: string | undefined;
    let voice: string = 'en-NG-EzinneNeural';
    let sessionId: string | undefined;
    try {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const body = await req.json() as TTSRequest;
        text = body.text;
        voice = body.voice ?? voice;
        sessionId = body.sessionId;
      } else {
        const raw = await req.text();
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as TTSRequest;
            text = parsed.text;
            voice = parsed.voice ?? voice;
            sessionId = parsed.sessionId;
          } catch {
            const url = new URL(req.url);
            text = url.searchParams.get('text') ?? raw;
            voice = url.searchParams.get('voice') ?? voice;
            sessionId = url.searchParams.get('sessionId') ?? undefined;
          }
        }
      }
    } catch (_e) {
      // Fallback to URL params
      const url = new URL(req.url);
      text = url.searchParams.get('text') ?? undefined;
      voice = url.searchParams.get('voice') ?? voice;
      sessionId = url.searchParams.get('sessionId') ?? undefined;
    }

    // Input validation
    if (!text || typeof text !== 'string') {
      await logTTSUsage(supabase, {
        userId, sessionId, text: 'INVALID_INPUT', voice, 
        characterCount: 0, requestIP, userAgent,
        status: 'error', errorMessage: 'Invalid text input',
        processingTime: Date.now() - startTime
      });
      
      return new Response(
        JSON.stringify({ error: 'Invalid text input' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Text length validation (max 1000 characters for security)
    const characterCount = text.length;
    if (characterCount > 1000) {
      await logTTSUsage(supabase, {
        userId, sessionId, text: `TRUNCATED_${text.substring(0, 50)}...`, voice,
        characterCount, requestIP, userAgent,
        status: 'error', errorMessage: 'Text too long (max 1000 characters)',
        processingTime: Date.now() - startTime
      });
      
      return new Response(
        JSON.stringify({ error: 'Text too long. Maximum 1000 characters allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limiting
    const { data: isAllowed, error: rateLimitError } = await supabase.rpc(
      'check_tts_rate_limit',
      {
        check_user_id: userId,
        check_session_id: sessionId,
        check_ip: requestIP
      }
    );

    if (rateLimitError || !isAllowed) {
      await logTTSUsage(supabase, {
        userId, sessionId, text: text.substring(0, 100), voice,
        characterCount, requestIP, userAgent,
        status: 'rate_limited', errorMessage: 'Rate limit exceeded',
        processingTime: Date.now() - startTime
      });
      
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize text (remove potential injection attempts)
    const sanitizedText = sanitizeText(text);
    
    // Call ODIA TTS service
    const ttsBaseUrl = 'https://odia-tts-render.onrender.com';
    const ttsUrl = `${ttsBaseUrl}/speak?text=${encodeURIComponent(sanitizedText)}&voice=${encodeURIComponent(voice)}`;
    
    const ttsResponse = await fetch(ttsUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'LexiPay-Secure-TTS/1.0',
        'Accept': 'audio/mpeg, audio/wav, audio/*',
      },
    });

    if (!ttsResponse.ok) {
      const errorMessage = `TTS service error: ${ttsResponse.status} ${ttsResponse.statusText}`;
      
      await logTTSUsage(supabase, {
        userId, sessionId, text: sanitizedText.substring(0, 100), voice,
        characterCount, requestIP, userAgent,
        status: 'error', errorMessage,
        processingTime: Date.now() - startTime
      });
      
      return new Response(
        JSON.stringify({ error: 'TTS service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get audio data
    const audioBuffer = await ttsResponse.arrayBuffer();
    const processingTime = Date.now() - startTime;

    // Log successful usage
    await logTTSUsage(supabase, {
      userId, sessionId, text: sanitizedText.substring(0, 100), voice,
      characterCount, requestIP, userAgent,
      status: 'success', processingTime
    });

    // Return audio with security headers
    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'private, max-age=300', // Cache for 5 minutes
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    });

  } catch (error) {
    console.error('TTS Error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to sanitize text input
function sanitizeText(text: string): string {
  return text
    // Remove potential script/HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove control characters except newlines/tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit consecutive whitespace
    .replace(/\s+/g, ' ')
    // Trim
    .trim();
}

// Helper function to log TTS usage
async function logTTSUsage(
  supabase: any,
  params: {
    userId: string | null;
    sessionId?: string;
    text: string;
    voice: string;
    characterCount: number;
    requestIP: string;
    userAgent: string;
    status: 'success' | 'error' | 'rate_limited';
    errorMessage?: string;
    processingTime: number;
  }
) {
  try {
    await supabase.rpc('log_tts_usage', {
      log_user_id: params.userId,
      log_session_id: params.sessionId,
      log_text_content: params.text,
      log_voice_model: params.voice,
      log_character_count: params.characterCount,
      log_request_ip: params.requestIP,
      log_user_agent: params.userAgent,
      log_status: params.status,
      log_error_message: params.errorMessage,
      log_processing_time_ms: params.processingTime,
    });
  } catch (error) {
    console.error('Failed to log TTS usage:', error);
  }
}