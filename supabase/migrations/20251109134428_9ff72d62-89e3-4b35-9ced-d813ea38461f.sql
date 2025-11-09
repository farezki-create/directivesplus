
-- Migration: Corriger les fonctions SECURITY DEFINER surchargées
-- DROP des fonctions avec signatures complètes pour éviter les ambiguïtés

-- DROP check_rate_limit_secure (2 versions)
DROP FUNCTION IF EXISTS public.check_rate_limit_secure() CASCADE;
DROP FUNCTION IF EXISTS public.check_rate_limit_secure(text, text, integer, integer, inet, text) CASCADE;

-- DROP check_sms_rate_limit (2 versions)
DROP FUNCTION IF EXISTS public.check_sms_rate_limit() CASCADE;
DROP FUNCTION IF EXISTS public.check_sms_rate_limit(uuid, integer) CASCADE;

-- DROP check_access_code_rate_limit
DROP FUNCTION IF EXISTS public.check_access_code_rate_limit(inet, integer, integer) CASCADE;

-- DROP cleanup_expired_auth_codes
DROP FUNCTION IF EXISTS public.cleanup_expired_auth_codes() CASCADE;

-- DROP generate_auth_code
DROP FUNCTION IF EXISTS public.generate_auth_code(text, text, uuid) CASCADE;

-- DROP verify_auth_code
DROP FUNCTION IF EXISTS public.verify_auth_code(text, text) CASCADE;

-- DROP is_user_admin
DROP FUNCTION IF EXISTS public.is_user_admin(uuid) CASCADE;

-- DROP log_security_event_enhanced
DROP FUNCTION IF EXISTS public.log_security_event_enhanced(text, uuid, inet, text, jsonb, text, uuid, text) CASCADE;

-- DROP log_sms_attempt
DROP FUNCTION IF EXISTS public.log_sms_attempt(uuid, text, text, text, boolean, text) CASCADE;

-- DROP secure_document_access
DROP FUNCTION IF EXISTS public.secure_document_access(uuid, text, inet, text, text) CASCADE;

-- DROP validate_secure_document_access
DROP FUNCTION IF EXISTS public.validate_secure_document_access(uuid, text, uuid, inet, text) CASCADE;

-- DROP validate_session_security
DROP FUNCTION IF EXISTS public.validate_session_security() CASCADE;

-- DROP verify_document_access
DROP FUNCTION IF EXISTS public.verify_document_access(text, text, text, date) CASCADE;

-- Recréer les fonctions avec SET search_path = public

CREATE FUNCTION public.check_rate_limit_secure(
  p_identifier text,
  p_attempt_type text,
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 15,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS TABLE(allowed boolean, remaining_attempts integer, retry_after integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_attempt_count INTEGER;
BEGIN
  v_window_start := NOW() - INTERVAL '1 minute' * p_window_minutes;
  
  SELECT COUNT(*) INTO v_attempt_count
  FROM access_code_attempts
  WHERE ip_address = p_ip_address
    AND attempt_time > v_window_start
    AND success = FALSE;
  
  PERFORM log_security_event_secure(
    'rate_limit_check',
    auth.uid(),
    p_ip_address,
    p_user_agent,
    jsonb_build_object(
      'identifier', p_identifier,
      'attempt_type', p_attempt_type,
      'current_attempts', v_attempt_count,
      'max_attempts', p_max_attempts
    ),
    CASE WHEN v_attempt_count >= p_max_attempts THEN 'high' ELSE 'low' END
  );
  
  RETURN QUERY SELECT 
    v_attempt_count < p_max_attempts,
    GREATEST(0, p_max_attempts - v_attempt_count - 1),
    CASE WHEN v_attempt_count >= p_max_attempts THEN p_window_minutes * 60 ELSE 0 END;
END;
$$;

CREATE FUNCTION public.check_sms_rate_limit(
  p_user_id uuid,
  p_max_sms_per_hour integer DEFAULT 5
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count INTEGER;
  v_window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  v_window_start := date_trunc('hour', NOW());
  
  SELECT COUNT(*) INTO v_current_count
  FROM sms_send_logs
  WHERE user_id = p_user_id
    AND created_at >= v_window_start
    AND status = 'sent';
  
  RETURN v_current_count < p_max_sms_per_hour;
END;
$$;

CREATE FUNCTION public.check_access_code_rate_limit(
  p_ip_address inet,
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_attempt_count
  FROM access_code_attempts
  WHERE ip_address = p_ip_address
    AND success = FALSE
    AND attempt_time > (NOW() - INTERVAL '1 minute' * p_window_minutes);
  
  RETURN v_attempt_count < p_max_attempts;
END;
$$;

CREATE FUNCTION public.cleanup_expired_auth_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth_codes 
  WHERE expires_at < now() - interval '1 hour';
END;
$$;

CREATE FUNCTION public.generate_auth_code(
  p_target text,
  p_channel text,
  p_user_id uuid DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated_code TEXT := lpad(floor(random() * 1000000)::text, 6, '0');
  target_user_id UUID;
BEGIN
  IF p_user_id IS NULL THEN
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = p_target OR phone = p_target
    LIMIT 1;
  ELSE
    target_user_id := p_user_id;
  END IF;

  DELETE FROM auth_codes 
  WHERE target = p_target 
    AND used = false 
    AND expires_at < now();

  INSERT INTO auth_codes (user_id, target, channel, code, expires_at, used)
  VALUES (
    target_user_id,
    p_target,
    p_channel,
    generated_code,
    now() + interval '10 minutes',
    false
  );

  RETURN generated_code;
END;
$$;

CREATE FUNCTION public.verify_auth_code(
  p_target text,
  p_code text
)
RETURNS TABLE(is_valid boolean, user_id uuid, channel text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  valid_code RECORD;
BEGIN
  SELECT * INTO valid_code
  FROM auth_codes
  WHERE target = p_target
    AND code = p_code
    AND used = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    UPDATE auth_codes 
    SET used = true 
    WHERE id = valid_code.id;
    
    RETURN QUERY SELECT true, valid_code.user_id, valid_code.channel;
  ELSE
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT;
  END IF;
END;
$$;

CREATE FUNCTION public.is_user_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = is_user_admin.user_id
      AND ur.role = 'admin'
  );
END;
$$;

CREATE FUNCTION public.log_security_event_enhanced(
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
BEGIN
  INSERT INTO security_audit_logs (
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
    COALESCE(p_details, '{}'::jsonb) || 
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

CREATE FUNCTION public.log_sms_attempt(
  p_user_id uuid,
  p_phone_number text,
  p_status text,
  p_provider text,
  p_success boolean,
  p_error_message text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO sms_send_logs (
    user_id,
    phone_number,
    status,
    provider,
    error_message
  ) VALUES (
    p_user_id,
    p_phone_number,
    p_status,
    p_provider,
    p_error_message
  );
END;
$$;

CREATE FUNCTION public.secure_document_access(
  p_document_id uuid,
  p_access_method text,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_session_id text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  file_name text,
  file_path text,
  content_type text,
  user_id uuid,
  access_granted boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_document RECORD;
  v_access_granted BOOLEAN := FALSE;
  v_failure_reason TEXT;
BEGIN
  SELECT * INTO v_document
  FROM pdf_documents
  WHERE pdf_documents.id = p_document_id;
  
  IF NOT FOUND THEN
    v_failure_reason := 'Document not found';
  ELSE
    v_access_granted := TRUE;
  END IF;
  
  INSERT INTO medical_access_audit (
    user_id,
    resource_type,
    resource_id,
    access_method,
    ip_address,
    user_agent,
    access_granted,
    failure_reason,
    session_id
  ) VALUES (
    auth.uid(),
    'pdf_document',
    p_document_id,
    p_access_method,
    p_ip_address,
    p_user_agent,
    v_access_granted,
    v_failure_reason,
    p_session_id
  );
  
  IF v_access_granted THEN
    RETURN QUERY
    SELECT 
      v_document.id,
      v_document.file_name,
      v_document.file_path,
      v_document.content_type,
      v_document.user_id,
      v_access_granted;
  END IF;
END;
$$;

CREATE FUNCTION public.validate_secure_document_access(
  p_document_id uuid,
  p_access_code text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS TABLE(
  access_granted boolean,
  document_data jsonb,
  error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_document RECORD;
  v_shared_access RECORD;
  v_user_access BOOLEAN := FALSE;
  v_shared_access_valid BOOLEAN := FALSE;
BEGIN
  SELECT * INTO v_document
  FROM pdf_documents
  WHERE id = p_document_id;
  
  IF NOT FOUND THEN
    PERFORM log_security_event_secure(
      'document_not_found_access_attempt',
      p_user_id,
      p_ip_address,
      p_user_agent,
      jsonb_build_object('document_id', p_document_id),
      'medium'
    );
    
    RETURN QUERY SELECT FALSE, NULL::jsonb, 'Document not found'::text;
    RETURN;
  END IF;
  
  IF p_user_id IS NOT NULL AND v_document.user_id = p_user_id THEN
    v_user_access := TRUE;
  END IF;
  
  IF p_access_code IS NOT NULL THEN
    SELECT * INTO v_shared_access
    FROM shared_documents
    WHERE document_id = p_document_id
      AND access_code = p_access_code
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW());
      
    IF FOUND THEN
      v_shared_access_valid := TRUE;
    END IF;
  END IF;
  
  IF v_user_access OR v_shared_access_valid THEN
    PERFORM log_security_event_secure(
      'document_access_granted',
      p_user_id,
      p_ip_address,
      p_user_agent,
      jsonb_build_object(
        'document_id', p_document_id,
        'access_method', CASE WHEN v_user_access THEN 'owner' ELSE 'shared' END
      ),
      'low'
    );
    
    RETURN QUERY SELECT 
      TRUE,
      jsonb_build_object(
        'id', v_document.id,
        'file_name', v_document.file_name,
        'file_path', v_document.file_path,
        'content_type', v_document.content_type,
        'file_size', v_document.file_size
      ),
      NULL::text;
  ELSE
    PERFORM log_security_event_secure(
      'document_access_denied',
      p_user_id,
      p_ip_address,
      p_user_agent,
      jsonb_build_object(
        'document_id', p_document_id,
        'access_code_provided', p_access_code IS NOT NULL
      ),
      'high'
    );
    
    RETURN QUERY SELECT FALSE, NULL::jsonb, 'Access denied'::text;
  END IF;
END;
$$;

CREATE FUNCTION public.validate_session_security()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Placeholder for session validation logic
  RETURN;
END;
$$;

CREATE FUNCTION public.verify_document_access(
  p_access_code text,
  p_first_name text,
  p_last_name text,
  p_birth_date date
)
RETURNS TABLE(document_id uuid, is_full_access boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dac.document_id,
    dac.is_full_access
  FROM document_access_codes dac
  JOIN profiles p ON p.id = dac.user_id
  WHERE dac.access_code = p_access_code
    AND p.first_name = p_first_name
    AND p.last_name = p_last_name
    AND p.birth_date = p_birth_date
    AND (dac.expires_at IS NULL OR dac.expires_at > NOW());
END;
$$;
