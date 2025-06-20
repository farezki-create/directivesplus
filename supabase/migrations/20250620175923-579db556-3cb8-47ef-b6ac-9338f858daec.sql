
-- Vérifier et corriger les politiques RLS pour patient_alert_contacts

-- S'assurer que RLS est activé
ALTER TABLE public.patient_alert_contacts ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Users can create their own alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Users can update their own alert contacts" ON public.patient_alert_contacts;
DROP POLICY IF EXISTS "Users can delete their own alert contacts" ON public.patient_alert_contacts;

-- Créer les nouvelles politiques RLS correctes
CREATE POLICY "Users can view their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Users can create their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR UPDATE 
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can delete their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR DELETE 
  USING (auth.uid() = patient_id);
