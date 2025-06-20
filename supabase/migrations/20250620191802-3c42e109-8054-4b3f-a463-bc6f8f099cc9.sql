
-- Supprimer les politiques restrictives existantes
DROP POLICY IF EXISTS "Users can view their own alert settings" ON public.patient_alert_settings;
DROP POLICY IF EXISTS "Users can create their own alert settings" ON public.patient_alert_settings;
DROP POLICY IF EXISTS "Users can update their own alert settings" ON public.patient_alert_settings;
DROP POLICY IF EXISTS "Users can delete their own alert settings" ON public.patient_alert_settings;

-- Créer des politiques plus permissives pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can view alert settings" 
  ON public.patient_alert_settings 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Authenticated users can create alert settings" 
  ON public.patient_alert_settings 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Authenticated users can update alert settings" 
  ON public.patient_alert_settings 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Authenticated users can delete alert settings" 
  ON public.patient_alert_settings 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = patient_id);
