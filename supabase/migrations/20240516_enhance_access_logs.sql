
-- Amélioration de la table document_access_logs pour la conformité HDS
ALTER TABLE public.document_access_logs 
  ADD COLUMN IF NOT EXISTS resource_type TEXT,
  ADD COLUMN IF NOT EXISTS resource_id UUID,
  ADD COLUMN IF NOT EXISTS action_type TEXT,
  ADD COLUMN IF NOT EXISTS error_details TEXT,
  ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Index pour améliorer les performances des requêtes de journalisation
CREATE INDEX IF NOT EXISTS idx_document_access_logs_user_id ON public.document_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_document_access_logs_date ON public.document_access_logs(date_consultation);
CREATE INDEX IF NOT EXISTS idx_document_access_logs_action ON public.document_access_logs(action_type);

-- Fonction pour obtenir un journal des accès anonymisé (pour audit HDS)
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

-- Fonction pour récupérer les journaux d'accès d'un utilisateur spécifique
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

-- Politique RLS pour restreindre l'accès aux journaux
ALTER TABLE public.document_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs ne peuvent voir que leurs propres journaux d'accès"
  ON public.document_access_logs
  FOR SELECT
  USING (auth.uid() = user_id);
