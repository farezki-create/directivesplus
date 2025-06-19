
-- Créer une nouvelle table pour les documents chargés temporairement
CREATE TABLE public.uploaded_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  content_type TEXT,
  file_size INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Champ pour indiquer si c'est un document temporaire ou permanent
  is_temporary BOOLEAN DEFAULT true,
  -- Expiration optionnelle pour les documents temporaires
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- Activer RLS sur la nouvelle table
ALTER TABLE public.uploaded_documents ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour que les utilisateurs ne voient que leurs propres documents
CREATE POLICY "Users can view their own uploaded documents" 
  ON public.uploaded_documents 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploaded documents" 
  ON public.uploaded_documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploaded documents" 
  ON public.uploaded_documents 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploaded documents" 
  ON public.uploaded_documents 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_uploaded_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_uploaded_documents_updated_at
  BEFORE UPDATE ON public.uploaded_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_uploaded_documents_updated_at();
