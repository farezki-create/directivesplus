
-- 1. Fix pdf_documents anon access policy: enforce max_uses
DROP POLICY IF EXISTS "Public access via valid access codes" ON public.pdf_documents;

CREATE POLICY "Public access via valid access codes"
ON public.pdf_documents
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.document_access_codes dac
    WHERE dac.document_id = pdf_documents.id
      AND (dac.expires_at IS NULL OR dac.expires_at > now())
      AND (dac.max_uses IS NULL OR dac.current_uses < dac.max_uses)
  )
);

-- 2. Restrict realtime.messages SELECT to topic matching user id
DROP POLICY IF EXISTS "Authenticated users can read their own realtime messages" ON realtime.messages;

CREATE POLICY "Authenticated users can read their own realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND (
    -- topic must include the user's id (e.g., "directives:<uid>" or contain the uid)
    split_part(realtime.topic(), ':', 2) = auth.uid()::text
    OR realtime.topic() LIKE '%' || auth.uid()::text || '%'
  )
);
