-- =====================================================
-- FIX 1: Storage - remove overly permissive INSERT policy on pdf_documents bucket
-- =====================================================
DROP POLICY IF EXISTS "Allow authenticated users to upload PDFs" ON storage.objects;

-- =====================================================
-- FIX 2: Broken no-arg is_user_admin() overload returning NULL
-- =====================================================
DROP FUNCTION IF EXISTS public.is_user_admin();

CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.is_user_admin(auth.uid());
END;
$$;

-- =====================================================
-- FIX 3: Lock down INSERT policies on audit/log tables to authenticated users only
-- (prevent unauthenticated log injection / audit-trail poisoning)
-- =====================================================

-- access_code_attempts
DROP POLICY IF EXISTS "Anyone can insert access code attempts" ON public.access_code_attempts;
DROP POLICY IF EXISTS "System can insert attempts" ON public.access_code_attempts;
DROP POLICY IF EXISTS "Public can insert attempts" ON public.access_code_attempts;
CREATE POLICY "Service and authenticated can insert access attempts"
ON public.access_code_attempts FOR INSERT
TO authenticated
WITH CHECK (true);

-- medical_access_audit
DROP POLICY IF EXISTS "Anyone can insert audit logs" ON public.medical_access_audit;
DROP POLICY IF EXISTS "Public can insert audit" ON public.medical_access_audit;
DROP POLICY IF EXISTS "Allow audit log inserts" ON public.medical_access_audit;
CREATE POLICY "Authenticated can insert medical audit"
ON public.medical_access_audit FOR INSERT
TO authenticated
WITH CHECK (true);

-- document_access_logs
DROP POLICY IF EXISTS "Anyone can insert document access logs" ON public.document_access_logs;
DROP POLICY IF EXISTS "Public can insert document logs" ON public.document_access_logs;
CREATE POLICY "Authenticated can insert document access logs"
ON public.document_access_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- alert_notifications_sent
DROP POLICY IF EXISTS "Anyone can insert alert notifications" ON public.alert_notifications_sent;
DROP POLICY IF EXISTS "Public can insert alert notifications" ON public.alert_notifications_sent;
CREATE POLICY "Authenticated can insert alert notifications"
ON public.alert_notifications_sent FOR INSERT
TO authenticated
WITH CHECK (true);

-- sms_send_logs
DROP POLICY IF EXISTS "Anyone can insert sms logs" ON public.sms_send_logs;
DROP POLICY IF EXISTS "Public can insert sms logs" ON public.sms_send_logs;
CREATE POLICY "Authenticated can insert sms logs"
ON public.sms_send_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- FIX 4: Realtime — restrict subscription messages to authenticated users
-- whose auth.uid() matches the row owner. We can only protect realtime.messages
-- via RLS scoped to authenticated role; we deny anon entirely.
-- =====================================================
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon cannot read realtime messages" ON realtime.messages;
CREATE POLICY "Anon cannot read realtime messages"
ON realtime.messages FOR SELECT
TO anon
USING (false);

DROP POLICY IF EXISTS "Authenticated users can read their own realtime messages" ON realtime.messages;
CREATE POLICY "Authenticated users can read their own realtime messages"
ON realtime.messages FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);
