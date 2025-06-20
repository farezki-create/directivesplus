
-- Activer RLS sur les tables de logs sensibles qui n'en ont pas
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Only admins can view security audit logs" ON public.security_audit_logs;
DROP POLICY IF EXISTS "Only admins can insert security audit logs" ON public.security_audit_logs;

-- Créer des politiques RLS strictes pour security_audit_logs
-- Seuls les administrateurs peuvent voir les logs de sécurité
CREATE POLICY "Admins can view security audit logs" 
ON public.security_audit_logs FOR SELECT 
USING (public.is_current_user_admin());

-- Permettre l'insertion pour les utilisateurs authentifiés (pour le logging système)
CREATE POLICY "Authenticated users can insert security audit logs" 
ON public.security_audit_logs FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Seuls les administrateurs peuvent modifier/supprimer les logs
CREATE POLICY "Admins can update security audit logs" 
ON public.security_audit_logs FOR UPDATE 
USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete security audit logs" 
ON public.security_audit_logs FOR DELETE 
USING (public.is_current_user_admin());

-- Créer la table sms_send_logs si elle n'existe pas et appliquer RLS
CREATE TABLE IF NOT EXISTS public.sms_send_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  phone_number text NOT NULL,
  message_content text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamp with time zone DEFAULT now(),
  error_message text,
  provider text DEFAULT 'system',
  message_type text DEFAULT 'verification',
  created_at timestamp with time zone DEFAULT now()
);

-- Activer RLS sur sms_send_logs
ALTER TABLE public.sms_send_logs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour sms_send_logs
-- Seuls les administrateurs peuvent voir tous les logs SMS
CREATE POLICY "Admins can view all sms logs" 
ON public.sms_send_logs FOR SELECT 
USING (public.is_current_user_admin());

-- Les utilisateurs peuvent voir leurs propres logs SMS
CREATE POLICY "Users can view their own sms logs" 
ON public.sms_send_logs FOR SELECT 
USING (auth.uid() = user_id);

-- Permettre l'insertion pour le système
CREATE POLICY "System can insert sms logs" 
ON public.sms_send_logs FOR INSERT 
WITH CHECK (true);

-- Seuls les administrateurs peuvent modifier/supprimer
CREATE POLICY "Admins can update sms logs" 
ON public.sms_send_logs FOR UPDATE 
USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete sms logs" 
ON public.sms_send_logs FOR DELETE 
USING (public.is_current_user_admin());

-- Renforcer RLS sur les autres tables de logs existantes
-- Vérifier et renforcer access_code_attempts
DROP POLICY IF EXISTS "Only admins can view access code attempts" ON public.access_code_attempts;
DROP POLICY IF EXISTS "System can log access code attempts" ON public.access_code_attempts;

CREATE POLICY "Admins can view access code attempts" 
ON public.access_code_attempts FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "System can log access code attempts" 
ON public.access_code_attempts FOR INSERT 
WITH CHECK (true);

-- Renforcer document_access_logs
DROP POLICY IF EXISTS "Users can view their own document access logs" ON public.document_access_logs;
DROP POLICY IF EXISTS "System can insert document access logs" ON public.document_access_logs;

CREATE POLICY "Users can view their own document access logs" 
ON public.document_access_logs FOR SELECT 
USING (auth.uid() = user_id OR public.is_current_user_admin());

CREATE POLICY "System can insert document access logs" 
ON public.document_access_logs FOR INSERT 
WITH CHECK (true);

-- Renforcer medical_access_audit
DROP POLICY IF EXISTS "Users can view their own medical access audit" ON public.medical_access_audit;
DROP POLICY IF EXISTS "System can insert medical access audit" ON public.medical_access_audit;

CREATE POLICY "Users can view their own medical access audit" 
ON public.medical_access_audit FOR SELECT 
USING (auth.uid() = user_id OR public.is_current_user_admin());

CREATE POLICY "System can insert medical access audit" 
ON public.medical_access_audit FOR INSERT 
WITH CHECK (true);

-- Créer un trigger pour valider les données sensibles dans tous les logs
CREATE OR REPLACE FUNCTION public.validate_log_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Empêcher l'insertion de données sensibles en clair
  IF TG_TABLE_NAME IN ('sms_send_logs', 'security_audit_logs', 'access_code_attempts') THEN
    -- Vérifier les champs texte pour des données sensibles
    IF (NEW.message_content IS NOT NULL AND NEW.message_content ~* '(password|mot.de.passe|secret|token|api.key)') OR
       (NEW.error_message IS NOT NULL AND NEW.error_message ~* '(password|mot.de.passe|secret|token|api.key)') OR
       (NEW.user_agent IS NOT NULL AND NEW.user_agent ~* '(password|mot.de.passe|secret|token|api.key)') THEN
      RAISE EXCEPTION 'Sensitive data detected in log entry';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables de logs
DROP TRIGGER IF EXISTS validate_sms_logs ON public.sms_send_logs;
CREATE TRIGGER validate_sms_logs
  BEFORE INSERT OR UPDATE ON public.sms_send_logs
  FOR EACH ROW EXECUTE FUNCTION public.validate_log_data();

DROP TRIGGER IF EXISTS validate_security_logs ON public.security_audit_logs;
CREATE TRIGGER validate_security_logs
  BEFORE INSERT OR UPDATE ON public.security_audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.validate_log_data();
