-- Migration: Sécuriser les fonctions restantes (triggers et générateurs)
-- Suite de la correction du finding SUPA_function_search_path_mutable

-- ============================================
-- Fonctions de triggers pour updated_at
-- ============================================

CREATE OR REPLACE FUNCTION public.update_questionnaire_medical_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_otp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_patient_alert_contacts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_patient_alert_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_abonnes_institutions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_symptom_tracking_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_health_news_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_uploaded_documents_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_medical_data_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_directive_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================
-- Fonctions de triggers pour posts (likes/comments)
-- ============================================

CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- ============================================
-- Fonctions de validation (triggers)
-- ============================================

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

CREATE OR REPLACE FUNCTION public.set_shared_document_access_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.access_code IS NULL THEN
    NEW.access_code := generate_shared_access_code();
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================
-- Fonctions de génération de codes
-- ============================================

CREATE OR REPLACE FUNCTION public.generate_random_code(length integer)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_institution_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 12));
    SELECT EXISTS(
      SELECT 1 FROM public.institution_access_codes 
      WHERE institution_code = new_code
    ) INTO code_exists;
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_symptom_access_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(
      SELECT 1 FROM public.symptom_tracking 
      WHERE symptome_access_code = new_code 
      AND (shared_access_expires_at IS NULL OR shared_access_expires_at > now())
    ) INTO code_exists;
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_patient_access_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    SELECT EXISTS(
      SELECT 1 FROM patients 
      WHERE access_code = new_code 
      AND (access_code_expires_at IS NULL OR access_code_expires_at > now())
    ) INTO code_exists;
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_unique_access_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(
      SELECT 1 FROM shared_documents 
      WHERE access_code = new_code AND is_active = true
    ) INTO code_exists;
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_shared_access_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(
      SELECT 1 FROM shared_documents 
      WHERE access_code = new_code AND is_active = true
    ) INTO code_exists;
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$;

-- ============================================
-- Fonctions diverses de vérification
-- ============================================

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

CREATE OR REPLACE FUNCTION public.verify_directive_access(
  p_directive_id uuid, 
  p_name varchar, 
  p_birthdate date, 
  p_access_code varchar
)
RETURNS TABLE(is_valid boolean, directive_content text)
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
  FROM public.directives
  WHERE id = p_directive_id;
  
  SELECT * INTO v_profile_record
  FROM public.profiles
  WHERE id = v_user_id;
  
  IF v_profile_record.last_name = p_name 
     AND v_profile_record.birth_date = p_birthdate 
     AND (
       SELECT pgp_sym_decrypt(access_code::bytea, v_encryption_key) 
       FROM public.directives 
       WHERE id = p_directive_id
     ) = p_access_code THEN
      
      RETURN QUERY
        SELECT 
          TRUE,
          pgp_sym_decrypt(content::bytea, v_encryption_key)
        FROM public.directives
        WHERE id = p_directive_id;
  ELSE
      RETURN QUERY
        SELECT FALSE, NULL::text;
  END IF;
END;
$$;

-- ============================================
-- Fonctions vides (stubs pour compatibilité)
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