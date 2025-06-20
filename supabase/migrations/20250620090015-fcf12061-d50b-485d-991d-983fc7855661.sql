
-- Add is_private column to medical_documents table
ALTER TABLE public.medical_documents 
ADD COLUMN is_private boolean DEFAULT false;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.medical_documents.is_private IS 'Determines if the document is private (true) or accessible to authorized institutions (false)';
