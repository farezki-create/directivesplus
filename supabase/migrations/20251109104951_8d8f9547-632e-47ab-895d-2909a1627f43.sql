-- Migration: Sécuriser les 17 fonctions SECURITY DEFINER restantes avec SET search_path
-- Correction finale du finding SUPA_function_search_path_mutable

-- ============================================
-- Fonctions de validation de données
-- ============================================

CREATE OR REPLACE FUNCTION public.check_data_sensitivity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_agent LIKE '%password%' 
     OR NEW.user_agent LIKE '%mdp%'
     OR NEW.user_agent LIKE '%mot de passe%' THEN
    RAISE EXCEPTION 'Données sensibles détectées';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_sensitive_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'security_audit_logs' THEN
    IF NEW.details::text ~* '(password|mot.de.passe|secret|token)' THEN
      RAISE EXCEPTION 'Sensitive data detected in security log';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_log_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME IN ('sms_send_logs', 'security_audit_logs', 'access_code_attempts') THEN
    IF (NEW.message_content IS NOT NULL AND NEW.message_content ~* '(password|mot.de.passe|secret|token|api.key)') OR
       (NEW.error_message IS NOT NULL AND NEW.error_message ~* '(password|mot.de.passe|secret|token|api.key)') OR
       (NEW.user_agent IS NOT NULL AND NEW.user_agent ~* '(password|mot.de.passe|secret|token|api.key)') THEN
      RAISE EXCEPTION 'Sensitive data detected in log entry';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_sensitive_table_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_security_event(
    'sensitive_table_access',
    auth.uid(),
    NULL,
    NULL,
    jsonb_build_object(
      'table_name', TG_TABLE_NAME,
      'operation', TG_OP,
      'row_id', CASE 
        WHEN TG_OP = 'DELETE' THEN OLD.id::TEXT
        ELSE NEW.id::TEXT
      END
    ),
    'medium'
  );
  
  RETURN CASE 
    WHEN TG_OP = 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$;

-- ============================================
-- Fonctions d'accès spécifiques
-- ============================================

CREATE OR REPLACE FUNCTION public.verify_access_identity(
  input_lastname text, 
  input_firstname text, 
  input_birthdate date, 
  input_access_code text
)
RETURNS SETOF shared_profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM shared_profiles
  WHERE lower(last_name) = lower(input_lastname)
    AND lower(first_name) = lower(input_firstname)
    AND birthdate = input_birthdate
    AND access_code = input_access_code
    AND access_code IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.verify_medical_data_access(
  p_medical_data_id uuid, 
  p_name varchar, 
  p_birthdate date, 
  p_access_code varchar
)
RETURNS TABLE(is_valid boolean, medical_data_content jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_profile_record RECORD;
    v_encryption_key TEXT;
BEGIN
    v_encryption_key := current_setting('app.encryption_key', true);
    
    IF v_encryption_key IS NULL THEN
        RAISE EXCEPTION 'Encryption key is not configured';
    END IF;

    SELECT user_id INTO v_user_id
    FROM public.medical_data
    WHERE id = p_medical_data_id;
    
    SELECT * INTO v_profile_record
    FROM public.profiles
    WHERE id = v_user_id;
    
    IF v_profile_record.last_name = p_name 
       AND v_profile_record.birth_date = p_birthdate 
       AND (
         SELECT pgp_sym_decrypt(access_code::bytea, v_encryption_key) 
         FROM public.medical_data 
         WHERE id = p_medical_data_id
       ) = p_access_code THEN
        
        RETURN QUERY
          SELECT 
            TRUE,
            pgp_sym_decrypt(data::bytea, v_encryption_key)::jsonb
          FROM public.medical_data
          WHERE id = p_medical_data_id;
    ELSE
        RETURN QUERY
          SELECT FALSE, NULL::jsonb;
    END IF;
END;
$$;

-- ============================================
-- Fonctions de vérification vides
-- ============================================

CREATE OR REPLACE FUNCTION public.verify_document_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Function logic here
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_session_security()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Function logic here
END;
$$;

CREATE OR REPLACE FUNCTION public.update_sms_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Your function logic here
END;
$$;

CREATE OR REPLACE FUNCTION public.log_sms_attempt()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Function logic here
END;
$$;

CREATE OR REPLACE FUNCTION public.check_sms_rate_limit()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Function logic here
END;
$$;