
-- Fonction sécurisée pour récupérer les directives via accès institution
CREATE OR REPLACE FUNCTION public.get_institution_directives_secure(
  input_last_name text,
  input_first_name text,
  input_birth_date date,
  input_institution_code text
)
RETURNS TABLE(
  directive_id uuid,
  directive_content jsonb,
  created_at timestamp with time zone,
  pdf_documents jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_access_valid BOOLEAN;
BEGIN
  -- Vérifier l'accès via la fonction existante
  SELECT user_id, institution_code_valid INTO v_user_id, v_access_valid
  FROM public.verify_institution_access(
    input_last_name,
    input_first_name,
    input_birth_date,
    input_institution_code
  );
  
  -- Si l'accès n'est pas valide, retourner vide
  IF NOT v_access_valid OR v_user_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Retourner les directives ET les documents PDF
  RETURN QUERY
  SELECT 
    d.id as directive_id,
    d.content as directive_content,
    d.created_at,
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
            'description', pdf.description
          )
        )
        FROM pdf_documents pdf
        WHERE pdf.user_id = v_user_id
      ),
      '[]'::jsonb
    ) as pdf_documents
  FROM public.directives d
  WHERE d.user_id = v_user_id
    AND d.is_active = true
  ORDER BY d.created_at DESC;
END;
$$;
