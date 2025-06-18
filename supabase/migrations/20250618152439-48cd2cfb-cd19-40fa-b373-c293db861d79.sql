
-- Ajouter la colonne file_type manquante à la table pdf_documents
ALTER TABLE public.pdf_documents 
ADD COLUMN IF NOT EXISTS file_type TEXT;

-- Mettre à jour les enregistrements existants qui n'ont pas de file_type
UPDATE public.pdf_documents 
SET file_type = content_type 
WHERE file_type IS NULL AND content_type IS NOT NULL;

-- Mettre à jour les enregistrements qui n'ont ni file_type ni content_type
UPDATE public.pdf_documents 
SET file_type = 'application/pdf' 
WHERE file_type IS NULL AND content_type IS NULL;
