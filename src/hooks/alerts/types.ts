
export type ContactType = 
  | 'soignant' 
  | 'famille' 
  | 'personne_confiance' 
  | 'had' 
  | 'soins_palliatifs' 
  | 'infirmiere' 
  | 'medecin_traitant' 
  | 'autre';

export interface AlertContact {
  id: string;
  patient_id: string;
  contact_type: ContactType;
  contact_name: string;
  phone_number?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  contact_type: string;
  contact_name: string;
  phone_number?: string;
  email?: string;
  is_active: boolean;
}

export interface AlertSettings {
  id: string;
  patient_id: string;
  auto_alert_enabled: boolean;
  alert_threshold: number;
  symptom_types: string[];
  sms_enabled: boolean;
  sms_provider: 'twilio' | 'whatsapp';
  phone_number?: string;
  whatsapp_number?: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsFormData {
  auto_alert_enabled: boolean;
  alert_threshold: number;
  symptom_types: string[];
  sms_enabled: boolean;
  sms_provider: 'twilio' | 'whatsapp';
  phone_number?: string;
  whatsapp_number?: string;
}
