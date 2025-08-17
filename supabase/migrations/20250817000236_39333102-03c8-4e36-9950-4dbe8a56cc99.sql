-- Fix Critical Security Issues (Phase 1 & 2)

-- 1. Fix security_audit table RLS vulnerability
DROP POLICY IF EXISTS "security_audit_select_policy" ON public.security_audit;
DROP POLICY IF EXISTS "security_audit_insert_policy" ON public.security_audit;

-- Create restrictive RLS policy for security_audit (service role only)
CREATE POLICY "security_audit_service_only_read" 
ON public.security_audit 
FOR SELECT 
USING (auth.role() = 'service_role');

CREATE POLICY "security_audit_service_only_insert" 
ON public.security_audit 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- 2. Fix search path vulnerability in database functions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.sessions WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_pin_rate_limit(session_phone text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
DECLARE
  session_record RECORD;
BEGIN
  SELECT pin_attempts, last_pin_attempt 
  INTO session_record 
  FROM public.sessions 
  WHERE phone = session_phone;
  
  -- If no session found, allow
  IF NOT FOUND THEN
    RETURN true;
  END IF;
  
  -- Reset attempts if more than 15 minutes have passed
  IF session_record.last_pin_attempt IS NULL OR 
     session_record.last_pin_attempt < (now() - interval '15 minutes') THEN
    UPDATE public.sessions 
    SET pin_attempts = 0, last_pin_attempt = now()
    WHERE phone = session_phone;
    RETURN true;
  END IF;
  
  -- Check if under rate limit (max 3 attempts per 15 minutes)
  RETURN session_record.pin_attempts < 3;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_pin_attempts(session_phone text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
BEGIN
  UPDATE public.sessions 
  SET pin_attempts = pin_attempts + 1, 
      last_pin_attempt = now()
  WHERE phone = session_phone;
END;
$function$;

-- 3. Create secure TTS audit table for monitoring
CREATE TABLE IF NOT EXISTS public.tts_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  text_content TEXT NOT NULL,
  voice_model TEXT NOT NULL DEFAULT 'en-NG-EzinneNeural',
  character_count INTEGER NOT NULL,
  request_ip INET,
  user_agent TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'rate_limited')),
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on TTS logs
ALTER TABLE public.tts_usage_logs ENABLE ROW LEVEL SECURITY;

-- TTS logs can only be read by service role
CREATE POLICY "tts_logs_service_only" 
ON public.tts_usage_logs 
FOR ALL 
USING (auth.role() = 'service_role');

-- 4. Create rate limiting table for TTS
CREATE TABLE IF NOT EXISTS public.tts_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  request_ip INET NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate limits
ALTER TABLE public.tts_rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limits can only be accessed by service role
CREATE POLICY "tts_rate_limits_service_only" 
ON public.tts_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role');

-- 5. Create function for TTS rate limiting
CREATE OR REPLACE FUNCTION public.check_tts_rate_limit(
  check_user_id UUID DEFAULT NULL,
  check_session_id TEXT DEFAULT NULL,
  check_ip INET DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $function$
DECLARE
  rate_record RECORD;
  max_requests_per_hour INTEGER := 100; -- Rate limit: 100 requests per hour
  max_requests_per_minute INTEGER := 10; -- Rate limit: 10 requests per minute
  current_window TIMESTAMP WITH TIME ZONE;
BEGIN
  current_window := date_trunc('hour', now());
  
  -- Check if user/session/IP is blocked
  SELECT * INTO rate_record 
  FROM public.tts_rate_limits 
  WHERE (
    (check_user_id IS NOT NULL AND user_id = check_user_id) OR
    (check_session_id IS NOT NULL AND session_id = check_session_id) OR
    (check_ip IS NOT NULL AND request_ip = check_ip)
  )
  AND blocked_until > now();
  
  -- If blocked, return false
  IF FOUND THEN
    RETURN false;
  END IF;
  
  -- Check hourly rate limit
  SELECT COUNT(*) as request_count INTO rate_record
  FROM public.tts_rate_limits 
  WHERE (
    (check_user_id IS NOT NULL AND user_id = check_user_id) OR
    (check_session_id IS NOT NULL AND session_id = check_session_id) OR
    (check_ip IS NOT NULL AND request_ip = check_ip)
  )
  AND window_start >= current_window;
  
  -- If over hourly limit, block for 1 hour
  IF rate_record.request_count >= max_requests_per_hour THEN
    INSERT INTO public.tts_rate_limits (user_id, session_id, request_ip, blocked_until)
    VALUES (check_user_id, check_session_id, check_ip, now() + interval '1 hour')
    ON CONFLICT DO NOTHING;
    RETURN false;
  END IF;
  
  -- Check minute rate limit
  SELECT COUNT(*) as request_count INTO rate_record
  FROM public.tts_rate_limits 
  WHERE (
    (check_user_id IS NOT NULL AND user_id = check_user_id) OR
    (check_session_id IS NOT NULL AND session_id = check_session_id) OR
    (check_ip IS NOT NULL AND request_ip = check_ip)
  )
  AND created_at >= (now() - interval '1 minute');
  
  -- If over minute limit, block for 5 minutes
  IF rate_record.request_count >= max_requests_per_minute THEN
    INSERT INTO public.tts_rate_limits (user_id, session_id, request_ip, blocked_until)
    VALUES (check_user_id, check_session_id, check_ip, now() + interval '5 minutes')
    ON CONFLICT DO NOTHING;
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

-- 6. Create function to log TTS usage
CREATE OR REPLACE FUNCTION public.log_tts_usage(
  log_user_id UUID DEFAULT NULL,
  log_session_id TEXT DEFAULT NULL,
  log_text_content TEXT DEFAULT NULL,
  log_voice_model TEXT DEFAULT 'en-NG-EzinneNeural',
  log_character_count INTEGER DEFAULT 0,
  log_request_ip INET DEFAULT NULL,
  log_user_agent TEXT DEFAULT NULL,
  log_status TEXT DEFAULT 'success',
  log_error_message TEXT DEFAULT NULL,
  log_processing_time_ms INTEGER DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $function$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.tts_usage_logs (
    user_id, session_id, text_content, voice_model, character_count,
    request_ip, user_agent, status, error_message, processing_time_ms
  ) VALUES (
    log_user_id, log_session_id, log_text_content, log_voice_model, log_character_count,
    log_request_ip, log_user_agent, log_status, log_error_message, log_processing_time_ms
  ) RETURNING id INTO log_id;
  
  -- Also update rate limiting table
  INSERT INTO public.tts_rate_limits (user_id, session_id, request_ip)
  VALUES (log_user_id, log_session_id, log_request_ip)
  ON CONFLICT DO NOTHING;
  
  RETURN log_id;
END;
$function$;