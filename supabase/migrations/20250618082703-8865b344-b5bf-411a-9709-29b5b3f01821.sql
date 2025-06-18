
-- Table pour les contacts d'alerte du patient
CREATE TABLE public.patient_alert_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid REFERENCES auth.users(id) NOT NULL,
  contact_type text NOT NULL, -- 'soignant', 'famille', 'personne_confiance', 'had', 'soins_palliatifs', 'infirmiere', 'medecin_traitant', 'autre'
  contact_name text NOT NULL,
  phone_number text,
  email text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table pour les paramètres d'alerte automatique
CREATE TABLE public.patient_alert_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid REFERENCES auth.users(id) NOT NULL,
  auto_alert_enabled boolean DEFAULT false,
  alert_threshold integer DEFAULT 7, -- Seuil d'évaluation pour déclencher l'alerte
  symptom_types text[] DEFAULT ARRAY['douleur', 'dyspnee', 'anxiete'], -- Types de symptômes à surveiller
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(patient_id)
);

-- Table pour l'historique des alertes envoyées
CREATE TABLE public.alert_notifications_sent (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid REFERENCES auth.users(id) NOT NULL,
  symptom_tracking_id uuid REFERENCES public.symptom_tracking(id),
  contact_id uuid REFERENCES public.patient_alert_contacts(id),
  notification_type text NOT NULL, -- 'email', 'sms'
  recipient_contact text NOT NULL, -- email ou numéro de téléphone
  message_content text,
  sent_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'sent', -- 'sent', 'failed', 'pending'
  error_message text
);

-- Enable RLS
ALTER TABLE public.patient_alert_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_notifications_sent ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour patient_alert_contacts
CREATE POLICY "Users can manage their own alert contacts" ON public.patient_alert_contacts
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Admins can view all alert contacts" ON public.patient_alert_contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email LIKE '%@directivesplus.fr'
    )
  );

-- RLS Policies pour patient_alert_settings
CREATE POLICY "Users can manage their own alert settings" ON public.patient_alert_settings
  FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Admins can view all alert settings" ON public.patient_alert_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email LIKE '%@directivesplus.fr'
    )
  );

-- RLS Policies pour alert_notifications_sent
CREATE POLICY "Users can view their own alert notifications" ON public.alert_notifications_sent
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Admins can view all alert notifications" ON public.alert_notifications_sent
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email LIKE '%@directivesplus.fr'
    )
  );

CREATE POLICY "System can insert alert notifications" ON public.alert_notifications_sent
  FOR INSERT WITH CHECK (true);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_patient_alert_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patient_alert_contacts_updated_at
  BEFORE UPDATE ON public.patient_alert_contacts
  FOR EACH ROW EXECUTE PROCEDURE update_patient_alert_contacts_updated_at();

CREATE OR REPLACE FUNCTION update_patient_alert_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patient_alert_settings_updated_at
  BEFORE UPDATE ON public.patient_alert_settings
  FOR EACH ROW EXECUTE PROCEDURE update_patient_alert_settings_updated_at();
