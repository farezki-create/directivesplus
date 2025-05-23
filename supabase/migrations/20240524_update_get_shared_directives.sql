
-- Update the function to work with shared_code stored in the content JSONB
CREATE OR REPLACE FUNCTION public.get_directives_by_shared_code(
  input_nom text,
  input_prenom text,
  input_date_naissance date,
  input_shared_code text
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  titre text,
  contenu text,
  created_at timestamp,
  content jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id, 
    d.user_id, 
    d.content->>'title' as titre, 
    d.content->>'content' as contenu, 
    d.created_at,
    d.content
  FROM public.directives d
  JOIN public.profiles p ON p.id = d.user_id
  WHERE 
    p.last_name = input_nom
    AND p.first_name = input_prenom
    AND p.birth_date = input_date_naissance
    AND d.content->>'shared_code' = input_shared_code
    AND (d.content->>'shared_code_expires_at')::timestamp with time zone > now();
END;
$$;
