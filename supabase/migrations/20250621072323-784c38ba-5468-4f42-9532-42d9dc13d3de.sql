
-- Utiliser une approche différente pour vérifier les admins
-- Nous allons modifier les politiques pour utiliser directement auth.email()

-- Supprimer les politiques existantes sur patient_alert_settings
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can manage their alert settings" ON public.patient_alert_settings;
    DROP POLICY IF EXISTS "Users can view their own alert settings" ON public.patient_alert_settings;
    DROP POLICY IF EXISTS "Admins can manage all alert settings" ON public.patient_alert_settings;
    DROP POLICY IF EXISTS "Users can create their own alert settings" ON public.patient_alert_settings;
    DROP POLICY IF EXISTS "Users can update their own alert settings" ON public.patient_alert_settings;
    DROP POLICY IF EXISTS "Users can delete their own alert settings" ON public.patient_alert_settings;
END $$;

-- Créer des politiques simples qui fonctionnent
CREATE POLICY "Allow authenticated users to manage their alert settings" 
  ON public.patient_alert_settings 
  FOR ALL 
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.email() LIKE '%@directivesplus.fr'
  )
  WITH CHECK (
    auth.uid() = patient_id OR 
    auth.email() LIKE '%@directivesplus.fr'
  );
