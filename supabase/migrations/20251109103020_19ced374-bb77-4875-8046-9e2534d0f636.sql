-- Migration: Correction des politiques RLS utilisant la vérification email
-- Remplace toutes les vérifications '@directivesplus.fr' par has_role(auth.uid(), 'admin')

-- ============================================
-- 1. alert_notifications_sent
-- ============================================

DROP POLICY IF EXISTS "Admins can view all alert notifications" ON alert_notifications_sent;

CREATE POLICY "Admins can view all alert notifications"
ON alert_notifications_sent
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- 2. alertes
-- ============================================

DROP POLICY IF EXISTS "Admins can view all alerts" ON alertes;

CREATE POLICY "Admins can view all alerts"
ON alertes
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- 3. feedback_questions
-- ============================================

DROP POLICY IF EXISTS "feedback_questions_admin_only" ON feedback_questions;

CREATE POLICY "feedback_questions_admin_only"
ON feedback_questions
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- 4. feedback_responses
-- ============================================

DROP POLICY IF EXISTS "feedback_responses_admin_read_all" ON feedback_responses;

CREATE POLICY "feedback_responses_admin_read_all"
ON feedback_responses
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- 5. health_news (2 politiques)
-- ============================================

DROP POLICY IF EXISTS "Admins can manage all health news" ON health_news;
DROP POLICY IF EXISTS "Admins can manage news" ON health_news;

CREATE POLICY "Admins can manage all health news"
ON health_news
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- 6. health_news_media (2 politiques)
-- ============================================

DROP POLICY IF EXISTS "Admins can manage all health news media" ON health_news_media;
DROP POLICY IF EXISTS "Admins can manage news media" ON health_news_media;

CREATE POLICY "Admins can manage all health news media"
ON health_news_media
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- 7. patient_alert_contacts
-- ============================================

DROP POLICY IF EXISTS "Admins can view all alert contacts" ON patient_alert_contacts;

CREATE POLICY "Admins can view all alert contacts"
ON patient_alert_contacts
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- 8. patient_alert_settings (2 politiques)
-- ============================================

DROP POLICY IF EXISTS "Admins can view all alert settings" ON patient_alert_settings;

CREATE POLICY "Admins can view all alert settings"
ON patient_alert_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Politique pour permettre aux users de gérer leurs propres paramètres + admin
DROP POLICY IF EXISTS "Allow authenticated users to manage their alert settings" ON patient_alert_settings;

CREATE POLICY "Allow authenticated users to manage their alert settings"
ON patient_alert_settings
FOR ALL
USING ((auth.uid() = patient_id) OR has_role(auth.uid(), 'admin'))
WITH CHECK ((auth.uid() = patient_id) OR has_role(auth.uid(), 'admin'));

-- ============================================
-- 9. sms_send_logs
-- ============================================

DROP POLICY IF EXISTS "Admin only SMS logs access" ON sms_send_logs;

CREATE POLICY "Admin only SMS logs access"
ON sms_send_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));