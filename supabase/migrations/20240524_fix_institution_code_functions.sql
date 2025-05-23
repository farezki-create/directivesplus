
-- Update the function to return all directives (including test ones) so we can handle them properly on the client side
CREATE OR REPLACE FUNCTION public.get_directives_by_institution_code(
  input_nom text,
  input_prenom text,
  input_date_naissance date,
  input_institution_code text
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  content jsonb,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id, 
    d.user_id, 
    d.content,
    d.created_at
  FROM public.directives d
  JOIN public.profiles p ON p.id = d.user_id
  WHERE 
    p.last_name = input_nom
    AND p.first_name = input_prenom
    AND p.birth_date = input_date_naissance
    AND d.institution_code = input_institution_code
    AND d.institution_code_expires_at > now()
  ORDER BY 
    -- Prioritize real directives over test directives
    CASE WHEN d.content->>'created_for_institution_access' = 'true' THEN 1 ELSE 0 END,
    d.created_at DESC;
END;
$$;
