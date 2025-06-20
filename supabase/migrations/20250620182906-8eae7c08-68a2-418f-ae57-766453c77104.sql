
-- Supprimer les politiques restrictives existantes
DROP POLICY IF EXISTS "Users can view their own alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Users can create their own alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Users can update their own alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Users can delete their own alert contacts" ON public.patient_alert_contacts;

-- Créer des politiques plus permissives pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can view alert contacts" 
  ON public.patient_alert_contacts 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create alert contacts" 
  ON public.patient_alert_contacts 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update alert contacts" 
  ON public.patient_alert_contacts 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete alert contacts" 
  ON public.patient_alert_contacts 
  FOR DELETE 
  TO authenticated
  USING (true);
