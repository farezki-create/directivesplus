
-- Corriger les politiques RLS pour patient_alert_settings
DROP POLICY IF EXISTS "Authenticated users can view alert settings" ON public.patient_alert_settings;
DROP POLICY IF EXISTS "Authenticated users can create alert settings" ON public.patient_alert_settings;
DROP POLICY IF EXISTS "Authenticated users can update alert settings" ON public.patient_alert_settings;
DROP POLICY IF EXISTS "Authenticated users can delete alert settings" ON public.patient_alert_settings;

-- Créer des politiques plus simples et permissives
CREATE POLICY "Users can manage their alert settings" 
  ON public.patient_alert_settings 
  FOR ALL 
  TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);
