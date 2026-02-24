
CREATE OR REPLACE FUNCTION public.get_public_document(doc_id uuid)
RETURNS TABLE(
  id uuid,
  file_name text,
  file_path text,
  content_type text,
  user_id uuid,
  created_at timestamptz,
  description text,
  file_size integer,
  updated_at timestamptz,
  external_id text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pdf.id, pdf.file_name, pdf.file_path, pdf.content_type,
    pdf.user_id, pdf.created_at, pdf.description,
    pdf.file_size, pdf.updated_at, pdf.external_id
  FROM public.pdf_documents pdf
  WHERE pdf.id = doc_id
    AND (
      pdf.user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.document_access_codes dac
        WHERE dac.document_id = doc_id
          AND (dac.expires_at IS NULL OR dac.expires_at > now())
          AND (dac.max_uses IS NULL OR dac.current_uses < dac.max_uses)
      )
      OR EXISTS (
        SELECT 1 FROM public.shared_documents sd
        WHERE sd.document_id = doc_id::text
          AND sd.is_active = true
          AND (sd.expires_at IS NULL OR sd.expires_at > now())
      )
    );
END;
$$;
