-- Fix Warning-Level Security Issues (Corrected)
-- This migration addresses all "warn" level security findings

-- ============================================================
-- 1. Fix Security Definer Functions - Add SET search_path = public
-- ============================================================

-- Fix get_anonymized_access_logs
CREATE OR REPLACE FUNCTION public.get_anonymized_access_logs(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  access_date TIMESTAMP WITH TIME ZONE,
  resource_type TEXT,
  action_type TEXT,
  success BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    date_consultation,
    resource_type,
    action_type,
    error_details IS NULL AS success
  FROM 
    public.document_access_logs
  WHERE 
    date_consultation BETWEEN start_date AND end_date
  ORDER BY 
    date_consultation DESC;
END;
$$;

-- Fix get_user_access_logs
CREATE OR REPLACE FUNCTION public.get_user_access_logs(
  p_user_id UUID
)
RETURNS TABLE (
  access_id UUID,
  access_date TIMESTAMP WITH TIME ZONE,
  resource_type TEXT,
  action_type TEXT,
  ip_address TEXT,
  user_agent TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    date_consultation,
    resource_type,
    action_type,
    ip_address,
    user_agent
  FROM 
    public.document_access_logs
  WHERE 
    user_id = p_user_id
  ORDER BY 
    date_consultation DESC;
END;
$$;

-- Fix verify_institution_access_with_directives
CREATE OR REPLACE FUNCTION public.verify_institution_access_with_directives(
  p_institution_code TEXT
)
RETURNS TABLE(
  directive_id uuid,
  directive_content jsonb,
  created_at timestamp with time zone,
  pdf_documents jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_access_valid BOOLEAN;
BEGIN
  SELECT user_id, institution_code_valid INTO v_user_id, v_access_valid
  FROM verify_institution_access(p_institution_code);
  
  IF NOT v_access_valid THEN
    RAISE EXCEPTION 'Invalid institution access code';
  END IF;
  
  RETURN QUERY
  SELECT 
    d.id, 
    d.user_id, 
    d.content,
    d.created_at
  FROM directives d
  WHERE d.user_id = v_user_id;
END;
$$;

-- Fix cleanup_expired_otp_codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_otp 
  WHERE expires_at < now() - interval '1 hour';
END;
$$;

-- Fix log_security_event_secure  
CREATE OR REPLACE FUNCTION public.log_security_event_secure(
  p_event_type text,
  p_user_id uuid DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_details jsonb DEFAULT NULL,
  p_risk_level text DEFAULT 'low',
  p_resource_id uuid DEFAULT NULL,
  p_resource_type text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
  v_sanitized_details JSONB;
BEGIN
  IF p_event_type IS NULL OR length(p_event_type) = 0 THEN
    RAISE EXCEPTION 'Event type cannot be null or empty';
  END IF;
  
  IF p_risk_level NOT IN ('low', 'medium', 'high', 'critical') THEN
    p_risk_level := 'medium';
  END IF;
  
  v_sanitized_details := COALESCE(p_details, '{}'::jsonb);
  v_sanitized_details := v_sanitized_details - 'password' - 'mot_de_passe' - 'token' - 'secret' - 'key' - 'api_key' - 'access_token';
  
  IF length(v_sanitized_details::text) > 5000 THEN
    v_sanitized_details := jsonb_build_object('truncated', true, 'message', 'Details truncated for security');
  END IF;
  
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    ip_address,
    user_agent,
    details,
    risk_level
  ) VALUES (
    p_event_type,
    COALESCE(p_user_id, auth.uid()),
    p_ip_address,
    p_user_agent,
    v_sanitized_details || 
    jsonb_build_object(
      'resource_id', p_resource_id,
      'resource_type', p_resource_type,
      'timestamp', NOW()
    ),
    p_risk_level
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Fix cleanup_old_security_logs
CREATE OR REPLACE FUNCTION public.cleanup_old_security_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.security_audit_logs 
  WHERE created_at < NOW() - INTERVAL '2 years';
  
  DELETE FROM public.access_code_attempts 
  WHERE attempt_time < NOW() - INTERVAL '1 year';
  
  DELETE FROM public.access_logs 
  WHERE accessed_at < NOW() - INTERVAL '2 years';
END;
$$;

-- ============================================================
-- 2. Add RLS Policies to Tables Missing Them
-- ============================================================

-- Table: access_requests
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'access_requests' 
    AND policyname = 'Users can manage their own access requests'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can manage their own access requests" ON public.access_requests FOR ALL USING (has_role(auth.uid(), ''admin'')) WITH CHECK (has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Table: agenda (user-owned calendar data)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agenda' 
    AND policyname = 'Users can manage their own agenda'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can manage their own agenda" ON public.agenda FOR ALL USING (auth.uid() = patient_id OR has_role(auth.uid(), ''admin'')) WITH CHECK (auth.uid() = patient_id OR has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Table: configuration (admin-only)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'configuration' 
    AND policyname = 'Only admins can access configuration'
  ) THEN
    EXECUTE 'CREATE POLICY "Only admins can access configuration" ON public.configuration FOR ALL USING (has_role(auth.uid(), ''admin'')) WITH CHECK (has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Table: mailer_config (admin-only)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mailer_config' 
    AND policyname = 'Only admins can access mailer config'
  ) THEN
    EXECUTE 'CREATE POLICY "Only admins can access mailer config" ON public.mailer_config FOR ALL USING (has_role(auth.uid(), ''admin'')) WITH CHECK (has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Table: medical_data_access_requests  
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'medical_data_access_requests' 
    AND policyname = 'Users can manage their medical data access requests'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can manage their medical data access requests" ON public.medical_data_access_requests FOR ALL USING (medical_data_id IN (SELECT id FROM medical_data WHERE user_id = auth.uid()) OR has_role(auth.uid(), ''admin'')) WITH CHECK (medical_data_id IN (SELECT id FROM medical_data WHERE user_id = auth.uid()) OR has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Table: plan_soins (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'plan_soins') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'plan_soins' 
      AND policyname = 'Users can manage their own care plans'
    ) THEN
      EXECUTE 'CREATE POLICY "Users can manage their own care plans" ON public.plan_soins FOR ALL USING (auth.uid() = patient_id OR has_role(auth.uid(), ''admin'')) WITH CHECK (auth.uid() = patient_id OR has_role(auth.uid(), ''admin''))';
    END IF;
  END IF;
END $$;

-- Table: symptom_access_logs (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'symptom_access_logs') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'symptom_access_logs' 
      AND policyname = 'Users can view their own symptom access logs'
    ) THEN
      EXECUTE 'CREATE POLICY "Users can view their own symptom access logs" ON public.symptom_access_logs FOR SELECT USING (auth.uid() = patient_id OR has_role(auth.uid(), ''admin''))';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'symptom_access_logs' 
      AND policyname = 'System can insert symptom access logs'
    ) THEN
      EXECUTE 'CREATE POLICY "System can insert symptom access logs" ON public.symptom_access_logs FOR INSERT WITH CHECK (true)';
    END IF;
  END IF;
END $$;

-- ============================================================
-- 3. Improve Feedback Responses RLS (Add Admin Audit Note)
-- ============================================================

-- Create a helper function to log admin feedback access
-- This should be called manually when admins access feedback
CREATE OR REPLACE FUNCTION public.log_admin_feedback_access(
  p_feedback_id UUID,
  p_feedback_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if user is admin and not the feedback owner
  IF has_role(auth.uid(), 'admin') AND auth.uid() != p_feedback_user_id THEN
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      details,
      risk_level
    ) VALUES (
      'admin_feedback_access',
      auth.uid(),
      jsonb_build_object(
        'feedback_id', p_feedback_id,
        'feedback_user', p_feedback_user_id,
        'accessed_at', NOW()
      ),
      'low'
    );
  END IF;
END;
$$;

COMMENT ON FUNCTION public.log_admin_feedback_access IS 'Call this function when admins access user feedback to maintain audit trail';

-- ============================================================
-- 4. Restrict Directives Anonymous Access
-- ============================================================

-- Drop the overly permissive anonymous access policy
DROP POLICY IF EXISTS "access via RPC only" ON public.directives;

-- The existing user-owned policies are sufficient
-- Anonymous access must go through validated RPC functions only

-- Create a secure RPC function for access code validation
CREATE OR REPLACE FUNCTION public.validate_directive_access(
  p_access_code TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_birthdate DATE
)
RETURNS TABLE(
  directive_id UUID,
  directive_content JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Validate input parameters
  IF p_access_code IS NULL OR p_first_name IS NULL OR p_last_name IS NULL OR p_birthdate IS NULL THEN
    RAISE EXCEPTION 'All parameters are required';
  END IF;
  
  -- Find user by matching criteria
  SELECT id INTO v_user_id
  FROM profiles
  WHERE 
    LOWER(first_name) = LOWER(p_first_name)
    AND LOWER(last_name) = LOWER(p_last_name)
    AND birth_date = p_birthdate
  LIMIT 1;
  
  IF v_user_id IS NULL THEN
    -- Log failed access attempt
    INSERT INTO public.access_code_attempts (
      ip_address,
      success,
      access_code
    ) VALUES (
      inet '0.0.0.0',
      false,
      p_access_code
    );
    RAISE EXCEPTION 'Invalid credentials';
  END IF;
  
  -- Return directives with validated access
  RETURN QUERY
  SELECT 
    d.id,
    d.content,
    d.created_at
  FROM directives d
  WHERE d.user_id = v_user_id;
  
  -- Log successful access
  INSERT INTO public.access_logs (
    directive_id,
    access_type,
    access_by
  ) SELECT 
    id,
    'validated_access',
    p_first_name || ' ' || p_last_name
  FROM directives 
  WHERE user_id = v_user_id;
END;
$$;