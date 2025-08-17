-- Fix critical security issues with TTS usage logs and rate limits
-- Add proper RLS policies to restrict access to user's own data only

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "tts_logs_service_only" ON public.tts_usage_logs;
DROP POLICY IF EXISTS "tts_rate_limits_service_only" ON public.tts_rate_limits;

-- Create user-specific policies for TTS usage logs
CREATE POLICY "Users can view their own TTS logs" 
ON public.tts_usage_logs 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (user_id IS NULL AND session_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.sessions WHERE sessions.phone = session_id AND auth.jwt() ->> 'phone' = session_id
  ))
);

CREATE POLICY "Service role can manage all TTS logs" 
ON public.tts_usage_logs 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create user-specific policies for TTS rate limits
CREATE POLICY "Users can view their own rate limits" 
ON public.tts_rate_limits 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (user_id IS NULL AND session_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.sessions WHERE sessions.phone = session_id AND auth.jwt() ->> 'phone' = session_id
  ))
);

CREATE POLICY "Service role can manage all rate limits" 
ON public.tts_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();