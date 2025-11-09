
-- Migration: Corriger les dernières fonctions SECURITY DEFINER surchargées
-- DROP toutes les versions de log_sms_attempt et validate_session_security

-- DROP log_sms_attempt (3 versions)
DROP FUNCTION IF EXISTS public.log_sms_attempt() CASCADE;
DROP FUNCTION IF EXISTS public.log_sms_attempt(uuid, text, text, text, boolean, text) CASCADE;
DROP FUNCTION IF EXISTS public.log_sms_attempt(uuid, text, text, text, inet, text) CASCADE;

-- DROP validate_session_security (2 versions)
DROP FUNCTION IF EXISTS public.validate_session_security() CASCADE;
DROP FUNCTION IF EXISTS public.validate_session_security(uuid, inet, text, text) CASCADE;

-- Recréer log_sms_attempt avec signature complète et utile
CREATE FUNCTION public.log_sms_attempt(
  p_user_id uuid,
  p_recipient_phone text,
  p_message_content text,
  p_sender_name text,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO sms_send_logs (
    user_id,
    recipient_phone,
    message_content,
    sender_name,
    ip_address,
    user_agent,
    status
  ) VALUES (
    p_user_id,
    p_recipient_phone,
    p_message_content,
    p_sender_name,
    p_ip_address,
    p_user_agent,
    'pending'
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Recréer validate_session_security avec signature complète
CREATE FUNCTION public.validate_session_security(
  p_user_id uuid,
  p_ip_address inet,
  p_user_agent text,
  p_browser_fingerprint text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_count INTEGER;
  v_ip_mismatch BOOLEAN := FALSE;
BEGIN
  -- Check for too many active sessions
  SELECT COUNT(*) INTO v_session_count
  FROM user_sessions
  WHERE user_id = p_user_id
    AND is_active = true
    AND expires_at > NOW();
  
  -- Allow max 5 concurrent sessions
  IF v_session_count > 5 THEN
    RETURN FALSE;
  END IF;
  
  -- Check for IP address changes (suspicious if too frequent)
  SELECT EXISTS(
    SELECT 1 FROM user_sessions
    WHERE user_id = p_user_id
      AND ip_address != p_ip_address
      AND created_at > (NOW() - INTERVAL '1 hour')
      AND is_active = true
  ) INTO v_ip_mismatch;
  
  -- Log suspicious activity if IP changes frequently
  IF v_ip_mismatch THEN
    INSERT INTO security_audit_logs (
      event_type,
      user_id,
      ip_address,
      user_agent,
      details,
      risk_level
    ) VALUES (
      'suspicious_ip_change',
      p_user_id,
      p_ip_address,
      p_user_agent,
      jsonb_build_object(
        'browser_fingerprint', p_browser_fingerprint,
        'session_count', v_session_count
      ),
      'medium'
    );
  END IF;
  
  RETURN TRUE;
END;
$$;
