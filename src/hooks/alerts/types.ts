
export interface ProfileAlertContact {
  id: string;
  contact_type: string;
  contact_name: string;
  phone_number?: string;
  email?: string;
}

export interface ProfileAlertSettings {
  auto_alert_enabled: boolean;
  alert_threshold: number;
  symptom_types: string[];
  sms_enabled: boolean;
  sms_provider: 'twilio' | 'whatsapp';
  phone_number?: string;
  whatsapp_number?: string;
}

export interface ProfileAlertData {
  alert_contacts: ProfileAlertContact[];
  alert_settings: ProfileAlertSettings;
}

// Additional types for the alert system
export interface AlertContact {
  id: string;
  patient_id: string;
  contact_type: 'soignant' | 'famille' | 'personne_confiance' | 'had' | 'soins_palliatifs' | 'infirmiere' | 'medecin_traitant' | 'autre';
  contact_name: string;
  phone_number?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export type ContactType = 'soignant' | 'famille' | 'personne_confiance' | 'had' | 'soins_palliatifs' | 'infirmiere' | 'medecin_traitant' | 'autre';

export interface ContactFormData {
  contact_type: string;
  contact_name: string;
  phone_number?: string;
  email?: string;
  is_active: boolean;
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
