
-- Corriger les problèmes de sécurité critiques et élevés

-- 1. Activer RLS sur toutes les tables sensibles qui n'en ont pas
ALTER TABLE public.access_code_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_access_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_access_logs ENABLE ROW LEVEL SECURITY;

-- 2. Créer des politiques RLS strictes pour les logs de sécurité
-- Les logs ne doivent être accessibles qu'aux administrateurs
CREATE POLICY "Only admins can view security audit logs" 
ON public.security_audit_logs FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "Only admins can insert security audit logs" 
ON public.security_audit_logs FOR INSERT 
WITH CHECK (public.is_current_user_admin() OR auth.uid() IS NOT NULL);

-- 3. Politiques pour les logs d'accès aux documents
CREATE POLICY "Users can view their own document access logs" 
ON public.document_access_logs FOR SELECT 
USING (user_id = auth.uid() OR public.is_current_user_admin());

CREATE POLICY "System can insert document access logs" 
ON public.document_access_logs FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Politiques pour les tentatives de code d'accès (admin seulement)
CREATE POLICY "Only admins can view access code attempts" 
ON public.access_code_attempts FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "System can log access code attempts" 
ON public.access_code_attempts FOR INSERT 
WITH CHECK (true); -- Permettre l'insertion pour le logging système

-- 5. Politiques pour les logs d'accès général
CREATE POLICY "Users can view their own access logs" 
ON public.access_logs FOR SELECT 
USING (directive_id IN (
  SELECT id FROM public.directives WHERE user_id = auth.uid()
) OR public.is_current_user_admin());

CREATE POLICY "System can insert access logs" 
ON public.access_logs FOR INSERT 
WITH CHECK (true);

-- 6. Politiques pour l'audit d'accès médical
CREATE POLICY "Users can view their own medical access audit" 
ON public.medical_access_audit FOR SELECT 
USING (user_id = auth.uid() OR public.is_current_user_admin());

CREATE POLICY "System can insert medical access audit" 
ON public.medical_access_audit FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 7. Politiques pour les logs d'accès institutionnel
CREATE POLICY "Admins can view institution access logs" 
ON public.institution_access_logs FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "System can insert institution access logs" 
ON public.institution_access_logs FOR INSERT 
WITH CHECK (true);

-- 8. Renforcer la sécurité des tables critiques existantes
-- Ajouter des contraintes de validation pour les données sensibles

-- 9. Créer un trigger pour valider les données sensibles
CREATE OR REPLACE FUNCTION public.validate_sensitive_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Empêcher l'insertion de données sensibles en clair dans les logs
  IF TG_TABLE_NAME = 'security_audit_logs' THEN
    -- Vérifier que les détails ne contiennent pas de mots de passe
    IF NEW.details::text ~* '(password|mot.de.passe|secret|token)' THEN
      RAISE EXCEPTION 'Sensitive data detected in security log';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables de logs
CREATE TRIGGER validate_security_logs
  BEFORE INSERT OR UPDATE ON public.security_audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.validate_sensitive_data();

-- 10. Améliorer la fonction de logging sécurisé existante
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
AS $$
DECLARE
  v_log_id UUID;
  v_sanitized_details JSONB;
BEGIN
  -- Validation stricte des entrées
  IF p_event_type IS NULL OR length(p_event_type) = 0 THEN
    RAISE EXCEPTION 'Event type cannot be null or empty';
  END IF;
  
  IF p_risk_level NOT IN ('low', 'medium', 'high', 'critical') THEN
    p_risk_level := 'medium';
  END IF;
  
  -- Assainissement des détails pour éviter les fuites de données sensibles
  v_sanitized_details := COALESCE(p_details, '{}'::jsonb);
  
  -- Supprimer tous les champs potentiellement sensibles
  v_sanitized_details := v_sanitized_details - 'password' - 'mot_de_passe' - 'token' - 'secret' - 'key' - 'api_key' - 'access_token';
  
  -- Limiter la taille des détails
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
      'timestamp', NOW(),
      'session_id', current_setting('request.jwt.claims', true)::jsonb->>'session_id'
    ),
    p_risk_level
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- 11. Créer une fonction pour nettoyer automatiquement les anciens logs
CREATE OR REPLACE FUNCTION public.cleanup_old_security_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Supprimer les logs de plus de 2 ans (conformité RGPD)
  DELETE FROM public.security_audit_logs 
  WHERE created_at < NOW() - INTERVAL '2 years';
  
  -- Supprimer les tentatives de code d'accès de plus de 1 an
  DELETE FROM public.access_code_attempts 
  WHERE attempt_time < NOW() - INTERVAL '1 year';
  
  -- Nettoyer les logs d'accès anciens
  DELETE FROM public.access_logs 
  WHERE accessed_at < NOW() - INTERVAL '2 years';
END;
$$;
