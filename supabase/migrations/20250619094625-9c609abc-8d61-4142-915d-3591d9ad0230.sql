
-- Activer RLS sur la table patient_alert_contacts
ALTER TABLE public.patient_alert_contacts ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres contacts d'alerte
CREATE POLICY "Users can view their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR SELECT 
  USING (auth.uid() = patient_id);

-- Politique pour permettre aux utilisateurs de créer leurs propres contacts d'alerte
CREATE POLICY "Users can create their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

-- Politique pour permettre aux utilisateurs de modifier leurs propres contacts d'alerte
CREATE POLICY "Users can update their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR UPDATE 
  USING (auth.uid() = patient_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres contacts d'alerte
CREATE POLICY "Users can delete their own alert contacts" 
  ON public.patient_alert_contacts 
  FOR DELETE 
  USING (auth.uid() = patient_id);

-- Faire de même pour la table patient_alert_settings
ALTER TABLE public.patient_alert_settings ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres paramètres d'alerte
CREATE POLICY "Users can view their own alert settings" 
  ON public.patient_alert_settings 
  FOR SELECT 
  USING (auth.uid() = patient_id);

-- Politique pour permettre aux utilisateurs de créer leurs propres paramètres d'alerte
CREATE POLICY "Users can create their own alert settings" 
  ON public.patient_alert_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

-- Politique pour permettre aux utilisateurs de modifier leurs propres paramètres d'alerte
CREATE POLICY "Users can update their own alert settings" 
  ON public.patient_alert_settings 
  FOR UPDATE 
  USING (auth.uid() = patient_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres paramètres d'alerte
CREATE POLICY "Users can delete their own alert settings" 
  ON public.patient_alert_settings 
  FOR DELETE 
  USING (auth.uid() = patient_id);
