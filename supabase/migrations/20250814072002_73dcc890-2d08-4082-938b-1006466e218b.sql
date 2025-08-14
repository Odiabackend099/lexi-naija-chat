-- CRITICAL SECURITY FIX: Replace dangerous public RLS policies on sessions table

-- Drop existing dangerous policies that allow public access
DROP POLICY IF EXISTS "read_all" ON public.sessions;
DROP POLICY IF EXISTS "update_all" ON public.sessions; 
DROP POLICY IF EXISTS "write_all" ON public.sessions;

-- Add session expiration and security fields
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours'),
ADD COLUMN IF NOT EXISTS pin_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_pin_attempt TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add index for cleanup operations
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON public.sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_phone ON public.sessions(phone);

-- Create secure RLS policies for authenticated users only
-- Users can only access sessions for their own phone number
CREATE POLICY "Users can read their own sessions" 
ON public.sessions 
FOR SELECT 
TO authenticated
USING (phone = concat('whatsapp:', auth.jwt() ->> 'phone'));

CREATE POLICY "Users can update their own sessions" 
ON public.sessions 
FOR UPDATE 
TO authenticated
USING (phone = concat('whatsapp:', auth.jwt() ->> 'phone'));

CREATE POLICY "Users can insert their own sessions" 
ON public.sessions 
FOR INSERT 
TO authenticated
WITH CHECK (phone = concat('whatsapp:', auth.jwt() ->> 'phone'));

-- Service role can manage all sessions (for edge functions)
CREATE POLICY "Service role can manage all sessions" 
ON public.sessions 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.sessions WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rate limiting for PIN attempts
CREATE OR REPLACE FUNCTION public.check_pin_rate_limit(session_phone TEXT)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment PIN attempts
CREATE OR REPLACE FUNCTION public.increment_pin_attempts(session_phone TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.sessions 
  SET pin_attempts = pin_attempts + 1, 
      last_pin_attempt = now()
  WHERE phone = session_phone;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table for security events
CREATE TABLE IF NOT EXISTS public.security_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.security_audit ENABLE ROW LEVEL SECURITY;

-- Only service role can write to audit log
CREATE POLICY "Service role can write audit logs" 
ON public.security_audit 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Create index for audit queries
CREATE INDEX IF NOT EXISTS idx_security_audit_phone ON public.security_audit(phone);
CREATE INDEX IF NOT EXISTS idx_security_audit_created_at ON public.security_audit(created_at);