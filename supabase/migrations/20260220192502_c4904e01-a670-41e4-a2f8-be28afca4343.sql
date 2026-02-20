
-- ============================================
-- Phase 1 & 2: Critical + Moderate RLS Fixes
-- ============================================

-- 1.3 Fix sms_codes: Remove anon read access
DROP POLICY IF EXISTS "Allow read for same phone" ON public.sms_codes;
CREATE POLICY "Service role only read sms_codes"
ON public.sms_codes FOR SELECT
TO service_role
USING (true);

-- 1.4 Fix abonnes_institutions: Replace JWT email check with proper auth
DROP POLICY IF EXISTS "Institutions can view their own data" ON public.abonnes_institutions;
CREATE POLICY "Institutions can view their own data"
ON public.abonnes_institutions FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

-- 2.1 Fix health_news: Only show published to non-admins
DROP POLICY IF EXISTS "Anyone can view published health news" ON public.health_news;
CREATE POLICY "Anyone can view published health news"
ON public.health_news FOR SELECT
USING (
  status = 'published'
  OR has_role(auth.uid(), 'admin')
);

-- 2.2 Fix feedback_questions: Restrict to authenticated
DROP POLICY IF EXISTS "feedback_questions_public_read" ON public.feedback_questions;
DROP POLICY IF EXISTS "Anyone can view active feedback questions" ON public.feedback_questions;
CREATE POLICY "Authenticated users can view active feedback questions"
ON public.feedback_questions FOR SELECT
TO authenticated
USING (is_active = true OR has_role(auth.uid(), 'admin'));

-- 2.3 Fix is_admin() function to use user_roles instead of email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN has_role(auth.uid(), 'admin');
END;
$$;

-- 2.4 Fix RLS email-based admin checks in policies
-- alert_notifications_sent
DROP POLICY IF EXISTS "Admins can view all alert notifications" ON public.alert_notifications_sent;
CREATE POLICY "Admins can view all alert notifications"
ON public.alert_notifications_sent FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- alertes
DROP POLICY IF EXISTS "Admins can view all alerts" ON public.alertes;
CREATE POLICY "Admins can view all alerts"
ON public.alertes FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- feedback_responses
DROP POLICY IF EXISTS "feedback_responses_admin_read_all" ON public.feedback_responses;
CREATE POLICY "feedback_responses_admin_read_all"
ON public.feedback_responses FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR has_role(auth.uid(), 'admin')
);

-- health_news admin management
DROP POLICY IF EXISTS "Admins can manage all health news" ON public.health_news;
DROP POLICY IF EXISTS "Admins can manage news" ON public.health_news;
CREATE POLICY "Admins can manage all health news"
ON public.health_news FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- health_news_media admin management
DROP POLICY IF EXISTS "Admins can manage all health news media" ON public.health_news_media;
DROP POLICY IF EXISTS "Admins can manage news media" ON public.health_news_media;
CREATE POLICY "Admins can manage all health news media"
ON public.health_news_media FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- patient_alert_contacts
DROP POLICY IF EXISTS "Admins can view all alert contacts" ON public.patient_alert_contacts;
CREATE POLICY "Admins can view all alert contacts"
ON public.patient_alert_contacts FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- patient_alert_settings
DROP POLICY IF EXISTS "Admins can view all alert settings" ON public.patient_alert_settings;
CREATE POLICY "Admins can view all alert settings"
ON public.patient_alert_settings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- sms_send_logs
DROP POLICY IF EXISTS "Admin only SMS logs access" ON public.sms_send_logs;
CREATE POLICY "Admin only SMS logs access"
ON public.sms_send_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- feedback_questions admin management
DROP POLICY IF EXISTS "feedback_questions_admin_only" ON public.feedback_questions;
CREATE POLICY "feedback_questions_admin_only"
ON public.feedback_questions FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
