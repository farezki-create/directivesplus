
-- Ajouter les colonnes pour la configuration SMS/WhatsApp
ALTER TABLE public.patient_alert_settings 
ADD COLUMN IF NOT EXISTS sms_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_provider TEXT CHECK (sms_provider IN ('twilio', 'whatsapp')) DEFAULT 'twilio',
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Mettre à jour le trigger de timestamp
CREATE OR REPLACE FUNCTION public.update_patient_alert_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';
