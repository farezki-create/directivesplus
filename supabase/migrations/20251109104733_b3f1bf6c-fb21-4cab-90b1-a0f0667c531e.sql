-- Migration: Sécuriser toutes les fonctions SECURITY DEFINER avec SET search_path
-- Correction du finding SUPA_function_search_path_mutable

-- ============================================
-- Fonctions de vérification et génération de codes
-- ============================================

CREATE OR REPLACE FUNCTION public.verify_otp(user_email_input text, user_otp_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    otp_record public.user_otp%ROWTYPE;
BEGIN
    SELECT * INTO otp_record
    FROM public.user_otp
    WHERE email = user_email_input
      AND otp_code = user_otp_input
      AND used = false
      AND expires_at > NOW()
    LIMIT 1;

    IF FOUND THEN
        UPDATE public.user_otp
        SET used = true, updated_at = NOW()
        WHERE id = otp_record.id;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_code(p_email text, p_code text, p_verification_type text DEFAULT 'email_confirmation')
RETURNS TABLE(is_valid boolean, user_id uuid, verification_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  valid_code RECORD;
BEGIN
  SELECT * INTO valid_code
  FROM public.auth_codes_verification
  WHERE email = p_email
    AND code = p_code
    AND verification_type = p_verification_type
    AND used = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    UPDATE public.auth_codes_verification 
    SET used = true 
    WHERE id = valid_code.id;
    RETURN QUERY SELECT true, valid_code.user_id, valid_code.verification_type;
  ELSE
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_verification_code(
  p_email text, 
  p_user_id uuid DEFAULT NULL, 
  p_verification_type text DEFAULT 'email_confirmation', 
  p_ip_address inet DEFAULT NULL, 
  p_user_agent text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated_code TEXT := lpad(floor(random() * 1000000)::text, 6, '0');
BEGIN
  DELETE FROM public.auth_codes_verification 
  WHERE email = p_email 
    AND verification_type = p_verification_type
    AND (used = true OR expires_at < now());

  INSERT INTO public.auth_codes_verification (
    email, code, user_id, verification_type, ip_address, user_agent
  ) VALUES (
    p_email, generated_code, p_user_id, p_verification_type, p_ip_address, p_user_agent
  );

  RETURN generated_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.auth_codes_verification 
  WHERE expires_at < now() - interval '1 hour';
END;
$$;

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

-- ============================================
-- Fonctions 2FA
-- ============================================

CREATE OR REPLACE FUNCTION public.generate_2fa_code(
  p_email text, 
  p_user_id uuid, 
  p_ip_address inet DEFAULT NULL, 
  p_user_agent text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated_code TEXT := lpad(floor(random() * 1000000)::text, 6, '0');
BEGIN
  DELETE FROM public.auth_codes_2fa 
  WHERE user_id = p_user_id 
    AND (used = true OR expires_at < now());

  INSERT INTO public.auth_codes_2fa (user_id, email, code, ip_address, user_agent)
  VALUES (p_user_id, p_email, generated_code, p_ip_address, p_user_agent);

  RETURN generated_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_2fa_code(p_email text, p_code text)
RETURNS TABLE(is_valid boolean, user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  valid_code RECORD;
BEGIN
  SELECT * INTO valid_code
  FROM public.auth_codes_2fa
  WHERE email = p_email
    AND code = p_code
    AND used = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    UPDATE public.auth_codes_2fa 
    SET used = true 
    WHERE id = valid_code.id;
    RETURN QUERY SELECT true, valid_code.user_id;
  ELSE
    RETURN QUERY SELECT false, NULL::UUID;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_2fa_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.auth_codes_2fa 
  WHERE expires_at < now() - interval '1 hour';
END;
$$;

-- ============================================
-- Fonctions de rôles et administration
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email LIKE '%@directivesplus.fr'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.is_user_admin(auth.uid());
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_by_email(target_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  u auth.users%ROWTYPE;
BEGIN
  SELECT * INTO u
  FROM auth.users
  WHERE email = target_email
  LIMIT 1;

  IF u IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN to_jsonb(u);
END;
$$;

-- ============================================
-- Fonctions d'accès aux documents
-- ============================================

CREATE OR REPLACE FUNCTION public.get_documents_with_access_code(
  p_last_name text, 
  p_first_name text, 
  p_birth_date date, 
  p_access_code text, 
  p_ip_address text DEFAULT NULL, 
  p_user_agent text DEFAULT NULL
)
RETURNS TABLE(document_id uuid, is_full_access boolean, user_id uuid, access_code_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_access_code_id UUID;
  v_is_full_access BOOLEAN;
  v_document_id UUID;
BEGIN
  SELECT 
    dac.user_id, 
    dac.id,
    dac.is_full_access,
    dac.document_id
  INTO 
    v_user_id, 
    v_access_code_id,
    v_is_full_access,
    v_document_id
  FROM document_access_codes dac
  JOIN profiles p ON p.id = dac.user_id
  WHERE 
    dac.access_code = p_access_code
    AND p.first_name = p_first_name
    AND p.last_name = p_last_name
    AND p.birth_date = p_birth_date
    AND (dac.expires_at IS NULL OR dac.expires_at > NOW());

  IF v_user_id IS NOT NULL THEN
    INSERT INTO document_access_logs (
      user_id,
      access_code_id,
      nom_consultant,
      prenom_consultant,
      ip_address,
      user_agent
    ) VALUES (
      v_user_id,
      v_access_code_id,
      p_last_name,
      p_first_name,
      p_ip_address,
      p_user_agent
    );
    
    RETURN QUERY
      SELECT 
        v_document_id,
        v_is_full_access,
        v_user_id,
        v_access_code_id;
  ELSE
    RETURN;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_public_document(doc_id uuid)
RETURNS TABLE(
  id uuid, 
  file_name text, 
  file_path text, 
  content_type text, 
  user_id uuid, 
  created_at timestamp with time zone, 
  description text, 
  file_size integer, 
  updated_at timestamp with time zone, 
  external_id text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    pdf.id,
    pdf.file_name,
    pdf.file_path,
    pdf.content_type,
    pdf.user_id,
    pdf.created_at,
    pdf.description,
    pdf.file_size,
    pdf.updated_at,
    pdf.external_id
  FROM public.pdf_documents pdf
  WHERE pdf.id = doc_id;
$$;

CREATE OR REPLACE FUNCTION public.validate_and_use_access_code(
  _access_code text, 
  _ip_address inet DEFAULT NULL, 
  _user_agent text DEFAULT NULL
)
RETURNS TABLE(is_valid boolean, document_id uuid, user_id uuid, error_message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _code_record RECORD;
BEGIN
  SELECT * INTO _code_record
  FROM public.document_access_codes
  WHERE access_code = _access_code;
  
  IF NOT FOUND THEN
    PERFORM public.log_security_event(
      'invalid_access_code_attempt',
      NULL,
      _ip_address,
      _user_agent,
      jsonb_build_object('access_code', _access_code),
      'high'
    );
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, 'Code d''accès invalide'::TEXT;
    RETURN;
  END IF;
  
  IF _code_record.expires_at IS NOT NULL AND _code_record.expires_at <= NOW() THEN
    PERFORM public.log_security_event(
      'expired_access_code_attempt',
      _code_record.user_id,
      _ip_address,
      _user_agent,
      jsonb_build_object('access_code', _access_code),
      'medium'
    );
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, 'Code d''accès expiré'::TEXT;
    RETURN;
  END IF;
  
  IF _code_record.max_uses IS NOT NULL AND _code_record.current_uses >= _code_record.max_uses THEN
    PERFORM public.log_security_event(
      'access_code_usage_exceeded',
      _code_record.user_id,
      _ip_address,
      _user_agent,
      jsonb_build_object('access_code', _access_code),
      'high'
    );
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, 'Code d''accès épuisé'::TEXT;
    RETURN;
  END IF;
  
  UPDATE public.document_access_codes
  SET 
    current_uses = current_uses + 1,
    last_used_at = NOW()
  WHERE id = _code_record.id;
  
  PERFORM public.log_security_event(
    'valid_access_code_used',
    _code_record.user_id,
    _ip_address,
    _user_agent,
    jsonb_build_object('access_code', _access_code, 'document_id', _code_record.document_id),
    'low'
  );
  
  RETURN QUERY SELECT TRUE, _code_record.document_id, _code_record.user_id, NULL::TEXT;
END;
$$;

-- ============================================
-- Fonctions directives
-- ============================================

CREATE OR REPLACE FUNCTION public.get_directives_by_shared_code(
  input_nom text, 
  input_prenom text, 
  input_date_naissance date, 
  input_shared_code text
)
RETURNS TABLE(id uuid, user_id uuid, titre text, contenu text, created_at timestamp without time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT d.id, d.user_id, d.titre, d.contenu, d.created_at
  FROM public.directives d
  JOIN public.profiles p ON p.id = d.user_id
  WHERE p.last_name = input_nom
    AND p.first_name = input_prenom
    AND p.birth_date = input_date_naissance
    AND d.shared_code = input_shared_code
    AND d.shared_code_expires_at > now();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_directives_by_institution_code(
  input_nom text, 
  input_prenom text, 
  input_date_naissance date, 
  input_institution_code text
)
RETURNS TABLE(id uuid, user_id uuid, content jsonb, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT d.id, d.user_id, d.content, d.created_at
  FROM directives d
  JOIN profiles p ON p.id = d.user_id
  WHERE p.last_name = input_nom
    AND p.first_name = input_prenom
    AND p.birth_date = input_date_naissance
    AND d.institution_code = input_institution_code
    AND d.institution_code_expires_at > now();
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_directive_access(
  p_access_code text, 
  p_first_name text, 
  p_last_name text, 
  p_birthdate date
)
RETURNS TABLE(directive_id uuid, directive_content jsonb, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF p_access_code IS NULL OR p_first_name IS NULL OR p_last_name IS NULL OR p_birthdate IS NULL THEN
    RAISE EXCEPTION 'All parameters are required';
  END IF;
  
  SELECT id INTO v_user_id
  FROM profiles
  WHERE 
    LOWER(first_name) = LOWER(p_first_name)
    AND LOWER(last_name) = LOWER(p_last_name)
    AND birth_date = p_birthdate
  LIMIT 1;
  
  IF v_user_id IS NULL THEN
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
  
  RETURN QUERY
  SELECT 
    d.id,
    d.content,
    d.created_at
  FROM directives d
  WHERE d.user_id = v_user_id;
  
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

-- ============================================
-- Fonctions institution
-- ============================================

CREATE OR REPLACE FUNCTION public.institution_has_patient_access(
  p_institution_email text, 
  p_patient_nom text, 
  p_patient_prenom text, 
  p_patient_naissance date
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.abonnes_institutions a
    JOIN public.droits_acces_nominal d ON d.abonne_id = a.id
    WHERE a.email = p_institution_email
      AND a.est_valide = true
      AND LOWER(TRIM(d.patient_nom)) = LOWER(TRIM(p_patient_nom))
      AND LOWER(TRIM(d.patient_prenom)) = LOWER(TRIM(p_patient_prenom))
      AND d.patient_naissance = p_patient_naissance
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_institution_accessible_patients(p_institution_email text)
RETURNS TABLE(
  patient_nom text, 
  patient_prenom text, 
  patient_naissance date, 
  date_autorisation timestamp with time zone, 
  notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.patient_nom,
    d.patient_prenom,
    d.patient_naissance,
    d.date_autorisation,
    d.notes
  FROM public.abonnes_institutions a
  JOIN public.droits_acces_nominal d ON d.abonne_id = a.id
  WHERE a.email = p_institution_email
    AND a.est_valide = true
  ORDER BY d.patient_nom, d.patient_prenom;
END;
$$;

CREATE OR REPLACE FUNCTION public.institution_has_structure_access(
  p_institution_email text, 
  p_structure_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.abonnes_institutions a
    JOIN public.institution_structure_access isa ON isa.institution_id = a.id
    JOIN public.structures_soins s ON s.id = isa.structure_id
    WHERE a.email = p_institution_email
      AND a.est_valide = true
      AND s.nom = p_structure_name
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_institution_access(
  input_last_name text, 
  input_first_name text, 
  input_birth_date date, 
  input_institution_code text
)
RETURNS TABLE(user_id uuid, first_name text, last_name text, birth_date date, institution_code_valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_institution_code_id UUID;
BEGIN
  SELECT iac.user_id, iac.id INTO v_user_id, v_institution_code_id
  FROM public.institution_access_codes iac
  WHERE iac.institution_code = input_institution_code
    AND iac.is_active = true
    AND (iac.expires_at IS NULL OR iac.expires_at > now());
  
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    up.id,
    up.first_name,
    up.last_name,
    up.birth_date,
    true as institution_code_valid
  FROM public.user_profiles up
  WHERE up.id = v_user_id
    AND lower(trim(up.last_name)) = lower(trim(input_last_name))
    AND lower(trim(up.first_name)) = lower(trim(input_first_name))
    AND up.birth_date = input_birth_date;
    
  IF FOUND THEN
    INSERT INTO public.institution_access_logs (
      institution_code_id,
      user_id,
      institution_name,
      access_type
    ) VALUES (
      v_institution_code_id,
      v_user_id,
      'Institution Access',
      'directives'
    );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_patient_directives_by_institution(
  input_last_name text, 
  input_first_name text, 
  input_birth_date date, 
  input_institution_code text
)
RETURNS TABLE(directive_id uuid, directive_content jsonb, created_at timestamp with time zone, patient_info jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_access_valid BOOLEAN;
BEGIN
  SELECT user_id, institution_code_valid INTO v_user_id, v_access_valid
  FROM public.verify_institution_access(
    input_last_name,
    input_first_name,
    input_birth_date,
    input_institution_code
  );
  
  IF NOT v_access_valid OR v_user_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    d.id,
    d.content,
    d.created_at,
    jsonb_build_object(
      'first_name', up.first_name,
      'last_name', up.last_name,
      'birth_date', up.birth_date
    ) as patient_info
  FROM public.directives d
  JOIN public.user_profiles up ON up.id = d.user_id
  WHERE d.user_id = v_user_id
    AND d.is_active = true
  ORDER BY d.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_institution_access_with_directives(p_institution_code text)
RETURNS TABLE(directive_id uuid, directive_content jsonb, created_at timestamp with time zone, pdf_documents jsonb)
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

CREATE OR REPLACE FUNCTION public.get_institution_directives_complete(
  input_last_name text, 
  input_first_name text, 
  input_birth_date date, 
  input_institution_code text
)
RETURNS TABLE(access_granted boolean, user_id uuid, patient_info jsonb, directives jsonb, documents jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_access_valid BOOLEAN;
  v_institution_code_id UUID;
BEGIN
  SELECT vua.user_id, vua.institution_code_valid INTO v_user_id, v_access_valid
  FROM public.verify_institution_access(
    input_last_name,
    input_first_name,
    input_birth_date,
    input_institution_code
  ) vua;
  
  IF NOT v_access_valid OR v_user_id IS NULL THEN
    RETURN QUERY
    SELECT 
      false as access_granted,
      NULL::uuid as user_id,
      NULL::jsonb as patient_info,
      NULL::jsonb as directives,
      NULL::jsonb as documents;
    RETURN;
  END IF;
  
  SELECT iac.id INTO v_institution_code_id
  FROM public.institution_access_codes iac
  WHERE iac.institution_code = input_institution_code
    AND iac.is_active = true
    AND (iac.expires_at IS NULL OR iac.expires_at > now());
    
  INSERT INTO public.institution_access_logs (
    institution_code_id,
    user_id,
    institution_name,
    access_type
  ) VALUES (
    v_institution_code_id,
    v_user_id,
    'Institution Access - Directives',
    'directives_complete'
  );
  
  RETURN QUERY
  SELECT 
    true as access_granted,
    v_user_id as user_id,
    jsonb_build_object(
      'first_name', up.first_name,
      'last_name', up.last_name,
      'birth_date', up.birth_date
    ) as patient_info,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', d.id,
            'content', d.content,
            'created_at', d.created_at,
            'type', 'directive'
          )
        )
        FROM public.directives d
        WHERE d.user_id = v_user_id
          AND d.is_active = true
      ),
      '[]'::jsonb
    ) as directives,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', pdf.id,
            'file_name', pdf.file_name,
            'file_path', pdf.file_path,
            'content_type', pdf.content_type,
            'file_size', pdf.file_size,
            'created_at', pdf.created_at,
            'description', pdf.description,
            'type', 'document'
          )
        )
        FROM public.pdf_documents pdf
        WHERE pdf.user_id = v_user_id
      ),
      '[]'::jsonb
    ) as documents
  FROM public.user_profiles up
  WHERE up.id = v_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_patient_directives_by_institution_access(
  input_last_name text, 
  input_first_name text, 
  input_birth_date date, 
  input_shared_code text
)
RETURNS TABLE(id uuid, last_name text, first_name text, birth_date date, institution_shared_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.last_name, u.first_name, u.birth_date, u.institution_shared_code
  FROM user_profiles u
  WHERE lower(trim(u.last_name)) = lower(trim(input_last_name))
    AND lower(trim(u.first_name)) = lower(trim(input_first_name))
    AND u.birth_date = input_birth_date
    AND u.institution_shared_code = input_shared_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.debug_institution_access_step_by_step(
  input_last_name text, 
  input_first_name text, 
  input_birth_date date, 
  input_shared_code text
)
RETURNS TABLE(step_name text, found_count integer, details text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'Step 1: Last name match'::text,
    COUNT(*)::integer,
    'Profiles with last_name matching: ' || input_last_name
  FROM user_profiles u
  WHERE lower(trim(u.last_name)) = lower(trim(input_last_name));

  RETURN QUERY
  SELECT 
    'Step 2: First + Last name match'::text,
    COUNT(*)::integer,
    'Profiles with both names matching'
  FROM user_profiles u
  WHERE lower(trim(u.last_name)) = lower(trim(input_last_name))
    AND lower(trim(u.first_name)) = lower(trim(input_first_name));

  RETURN QUERY
  SELECT 
    'Step 3: Full identity match'::text,
    COUNT(*)::integer,
    'Profiles with names + birthdate matching'
  FROM user_profiles u
  WHERE lower(trim(u.last_name)) = lower(trim(input_last_name))
    AND lower(trim(u.first_name)) = lower(trim(input_first_name))
    AND u.birth_date = input_birth_date;

  RETURN QUERY
  SELECT 
    'Step 4: Complete match'::text,
    COUNT(*)::integer,
    'Profiles with all criteria including institution code'
  FROM user_profiles u
  WHERE lower(trim(u.last_name)) = lower(trim(input_last_name))
    AND lower(trim(u.first_name)) = lower(trim(input_first_name))
    AND u.birth_date = input_birth_date
    AND u.institution_shared_code = input_shared_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.debug_patient_by_lastname(input_last_name text)
RETURNS TABLE(user_id uuid, profile_id uuid, first_name text, last_name text, birth_date date, institution_shared_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.id as profile_id,
    u.first_name,
    u.last_name,
    u.birth_date,
    u.institution_shared_code
  FROM user_profiles u
  WHERE lower(trim(u.last_name)) = lower(trim(input_last_name))
    AND u.institution_shared_code IS NOT NULL;
END;
$$;

-- ============================================
-- Fonctions de logs et sécurité
-- ============================================

CREATE OR REPLACE FUNCTION public.get_anonymized_access_logs(
  start_date timestamp with time zone, 
  end_date timestamp with time zone
)
RETURNS TABLE(access_date timestamp with time zone, resource_type text, action_type text, success boolean)
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

CREATE OR REPLACE FUNCTION public.get_user_access_logs(p_user_id uuid)
RETURNS TABLE(
  access_id uuid, 
  access_date timestamp with time zone, 
  resource_type text, 
  action_type text, 
  ip_address text, 
  user_agent text
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

CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type text, 
  _user_id uuid DEFAULT NULL, 
  _ip_address inet DEFAULT NULL, 
  _user_agent text DEFAULT NULL, 
  _details jsonb DEFAULT NULL, 
  _risk_level text DEFAULT 'low'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    ip_address,
    user_agent,
    details,
    risk_level
  ) VALUES (
    _event_type,
    COALESCE(_user_id, auth.uid()),
    _ip_address,
    _user_agent,
    _details,
    _risk_level
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.log_admin_feedback_access(p_feedback_id uuid, p_feedback_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

-- ============================================
-- Fonctions symptômes et patients
-- ============================================

CREATE OR REPLACE FUNCTION public.verify_symptom_shared_access(
  input_access_code text, 
  input_last_name text, 
  input_first_name text, 
  input_birth_date date
)
RETURNS TABLE(patient_id uuid, access_granted boolean, patient_info jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_patient_id UUID;
  v_profile RECORD;
BEGIN
  SELECT DISTINCT st.patient_id INTO v_patient_id
  FROM public.symptom_tracking st
  WHERE st.symptome_access_code = input_access_code
  AND (st.shared_access_expires_at IS NULL OR st.shared_access_expires_at > now())
  LIMIT 1;
  
  IF v_patient_id IS NULL THEN
    RETURN QUERY
    SELECT NULL::UUID, false, NULL::JSONB;
    RETURN;
  END IF;
  
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE id = v_patient_id;
  
  IF v_profile.last_name = input_last_name 
     AND v_profile.first_name = input_first_name
     AND v_profile.birth_date = input_birth_date THEN
    
    RETURN QUERY
    SELECT 
      v_patient_id,
      true,
      jsonb_build_object(
        'first_name', v_profile.first_name,
        'last_name', v_profile.last_name,
        'birth_date', v_profile.birth_date
      );
  ELSE
    RETURN QUERY
    SELECT v_patient_id, false, NULL::JSONB;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_patient_access_with_code(
  p_last_name text, 
  p_first_name text, 
  p_birth_date date, 
  p_access_code text
)
RETURNS TABLE(patient_id uuid, access_granted boolean, patient_info jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_patient RECORD;
BEGIN
  SELECT * INTO v_patient
  FROM patients p
  WHERE p.access_code = p_access_code
  AND (p.access_code_expires_at IS NULL OR p.access_code_expires_at > now());
  
  IF v_patient.id IS NULL THEN
    RETURN QUERY
    SELECT NULL::UUID, FALSE, NULL::JSONB;
    RETURN;
  END IF;
  
  IF LOWER(TRIM(v_patient.name)) LIKE '%' || LOWER(TRIM(p_last_name)) || '%'
     AND LOWER(TRIM(v_patient.name)) LIKE '%' || LOWER(TRIM(p_first_name)) || '%'
     AND v_patient.date_of_birth = p_birth_date THEN
    
    RETURN QUERY
    SELECT 
      v_patient.id,
      TRUE,
      jsonb_build_object(
        'name', v_patient.name,
        'date_of_birth', v_patient.date_of_birth,
        'id', v_patient.id
      );
  ELSE
    RETURN QUERY
    SELECT v_patient.id, FALSE, NULL::JSONB;
  END IF;
END;
$$;

-- ============================================
-- Fonctions de documents partagés
-- ============================================

CREATE OR REPLACE FUNCTION public.get_shared_documents_by_access_code(
  input_access_code text, 
  input_first_name text DEFAULT NULL, 
  input_last_name text DEFAULT NULL, 
  input_birth_date date DEFAULT NULL
)
RETURNS TABLE(document_id uuid, document_type text, document_data jsonb, user_id uuid, shared_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF input_first_name IS NOT NULL AND input_last_name IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      sd.document_id,
      sd.document_type,
      sd.document_data,
      sd.user_id,
      sd.shared_at
    FROM shared_documents sd
    JOIN profiles p ON p.id = sd.user_id
    WHERE sd.access_code = input_access_code
      AND sd.is_active = true
      AND (sd.expires_at IS NULL OR sd.expires_at > NOW())
      AND lower(trim(p.first_name)) = lower(trim(input_first_name))
      AND lower(trim(p.last_name)) = lower(trim(input_last_name))
      AND (input_birth_date IS NULL OR p.birth_date = input_birth_date);
  ELSE
    RETURN QUERY
    SELECT 
      sd.document_id,
      sd.document_type,
      sd.document_data,
      sd.user_id,
      sd.shared_at
    FROM shared_documents sd
    WHERE sd.access_code = input_access_code
      AND sd.is_active = true
      AND (sd.expires_at IS NULL OR sd.expires_at > NOW());
  END IF;
END;
$$;

-- ============================================
-- Fonctions d'authentification
-- ============================================

CREATE OR REPLACE FUNCTION public.generate_confirmation_code(target_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated_code text;
  target_user auth.users%ROWTYPE;
BEGIN
  SELECT * INTO target_user FROM auth.users WHERE email = target_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Utilisateur introuvable pour l''email %', target_email;
  END IF;

  generated_code := LPAD(TRUNC(RANDOM() * 1000000)::text, 6, '0');

  UPDATE auth.users
  SET user_metadata = jsonb_set(
    COALESCE(user_metadata, '{}'::jsonb),
    '{confirmation_code}',
    to_jsonb(generated_code),
    true
  )
  WHERE id = target_user.id;

  RETURN generated_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_user_session(user_email text, user_otp text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_id UUID;
    jwt_token TEXT;
    otp_valid BOOLEAN;
BEGIN
    otp_valid := verify_otp(user_email, user_otp);
    IF NOT otp_valid THEN
        RAISE EXCEPTION 'OTP invalide ou expiré';
    END IF;

    SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    IF NOT FOUND THEN
        INSERT INTO auth.users (email) VALUES (user_email)
        RETURNING id INTO user_id;
    END IF;

    jwt_token := auth.jwt(user_id);
    RETURN jwt_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_auth_email_via_brevo(
  email text, 
  type text, 
  confirmation_url text DEFAULT NULL, 
  recovery_url text DEFAULT NULL, 
  user_data jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  response_data JSONB;
  function_url TEXT;
BEGIN
  function_url := current_setting('app.supabase_url', true) || '/functions/v1/send-auth-email';
  
  RAISE LOG 'Calling Brevo email function for type: %, email: %', type, email;
  
  SELECT content::jsonb INTO response_data
  FROM http((
    'POST',
    function_url,
    ARRAY[
      http_header('Authorization', 'Bearer ' || current_setting('app.service_role_key', true)),
      http_header('Content-Type', 'application/json')
    ],
    'application/json',
    json_build_object(
      'email', email,
      'type', type,
      'confirmation_url', confirmation_url,
      'recovery_url', recovery_url,
      'user_data', user_data
    )::text
  ));
  
  IF response_data->>'success' = 'true' THEN
    RAISE LOG 'Email sent successfully via Brevo for %', email;
  ELSE
    RAISE WARNING 'Failed to send email via Brevo: %', response_data->>'error';
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error calling Brevo email function: %', SQLERRM;
END;
$$;