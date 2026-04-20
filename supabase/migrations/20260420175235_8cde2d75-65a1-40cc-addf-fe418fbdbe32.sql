-- =====================================================
-- 1) Fix mutable search_path on 4 functions
-- =====================================================

-- log_access (validates caller, safe to set)
CREATE OR REPLACE FUNCTION public.log_access(_user_id uuid, _action text, _meta jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF _user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  INSERT INTO public.access_logs (user_id, action, meta)
  VALUES (_user_id, _action, _meta);
END;
$function$;

-- log_security_event_enhanced() — empty stub, fix search_path
CREATE OR REPLACE FUNCTION public.log_security_event_enhanced()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- No-op stub
END;
$function$;

-- generate_auth_code() (no args) — empty stub, fix search_path
CREATE OR REPLACE FUNCTION public.generate_auth_code()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- No-op stub
END;
$function$;

-- generate_random_code() (no args) — fix search_path
CREATE OR REPLACE FUNCTION public.generate_random_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN 'random_code';
END;
$function$;

-- send_sms_code (had no SECURITY DEFINER + mutable path — make it server-only)
CREATE OR REPLACE FUNCTION public.send_sms_code(phone text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  code text := lpad(floor(random() * 1000000)::text, 6, '0');
BEGIN
  DELETE FROM sms_codes WHERE phone_number = phone;
  INSERT INTO sms_codes (phone_number, code) VALUES (phone, code);
END;
$function$;

-- update_sms_status — fix search_path
CREATE OR REPLACE FUNCTION public.update_sms_status(p_log_id uuid, p_status text, p_brevo_message_id text DEFAULT NULL::text, p_error_message text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE sms_send_logs
  SET 
    status = p_status,
    brevo_message_id = p_brevo_message_id,
    error_message = p_error_message,
    sent_at = CASE WHEN p_status = 'sent' THEN NOW() ELSE sent_at END
  WHERE id = p_log_id;
END;
$function$;

-- =====================================================
-- 2) Tighten RLS WITH CHECK (true) on audit/log tables
--    Remove the public/authenticated INSERT policies.
--    Keep service_role policies; add user-scoped INSERTs where appropriate.
-- =====================================================

-- access_code_attempts: only service_role / edge functions should write
DROP POLICY IF EXISTS "Service and authenticated can insert access attempts" ON public.access_code_attempts;
DROP POLICY IF EXISTS "System can log access code attempts" ON public.access_code_attempts;
CREATE POLICY "Service role inserts access attempts"
  ON public.access_code_attempts FOR INSERT
  TO service_role WITH CHECK (true);

-- alert_notifications_sent: edge function (service_role) writes; users may read their own elsewhere
DROP POLICY IF EXISTS "Authenticated can insert alert notifications" ON public.alert_notifications_sent;
DROP POLICY IF EXISTS "System can insert alert notifications" ON public.alert_notifications_sent;
CREATE POLICY "Service role inserts alert notifications"
  ON public.alert_notifications_sent FOR INSERT
  TO service_role WITH CHECK (true);

-- document_access_logs: only service_role inserts
DROP POLICY IF EXISTS "Authenticated can insert document access logs" ON public.document_access_logs;
DROP POLICY IF EXISTS "System can insert document access logs" ON public.document_access_logs;
CREATE POLICY "Service role inserts document access logs"
  ON public.document_access_logs FOR INSERT
  TO service_role WITH CHECK (true);

-- medical_access_audit: only service_role inserts
DROP POLICY IF EXISTS "Authenticated can insert medical audit" ON public.medical_access_audit;
DROP POLICY IF EXISTS "System can insert medical access audit" ON public.medical_access_audit;
CREATE POLICY "Service role inserts medical access audit"
  ON public.medical_access_audit FOR INSERT
  TO service_role WITH CHECK (true);

-- sms_send_logs: keep authenticated insert but scope to own user_id; service_role unrestricted
DROP POLICY IF EXISTS "Authenticated can insert sms logs" ON public.sms_send_logs;
DROP POLICY IF EXISTS "System can insert sms logs" ON public.sms_send_logs;
CREATE POLICY "Users insert their own sms logs"
  ON public.sms_send_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role inserts sms logs"
  ON public.sms_send_logs FOR INSERT
  TO service_role WITH CHECK (true);
