
-- Functions for handling shared directive codes
CREATE OR REPLACE FUNCTION update_directive_shared_code(
  directive_id UUID,
  code TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE directives
  SET 
    content = jsonb_set(
      jsonb_set(
        content, 
        '{shared_code}', 
        to_jsonb(code)
      ),
      '{shared_code_expires_at}', 
      to_jsonb(expires_at)
    )
  WHERE id = directive_id;
END;
$$;

CREATE OR REPLACE FUNCTION revoke_directive_shared_code(
  directive_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE directives
  SET 
    content = content - 'shared_code' - 'shared_code_expires_at'
  WHERE id = directive_id;
END;
$$;

CREATE OR REPLACE FUNCTION extend_directive_shared_code(
  directive_id UUID,
  new_expires_at TIMESTAMP WITH TIME ZONE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE directives
  SET 
    content = jsonb_set(
      content,
      '{shared_code_expires_at}', 
      to_jsonb(new_expires_at)
    )
  WHERE id = directive_id;
END;
$$;
