
export interface AlertContact {
  id: string;
  contact_type: string;
  contact_name: string;
  phone_number?: string;
  email?: string;
}

// Types pour les contacts d'alerte
export type ContactType = 
  | 'soignant'
  | 'famille' 
  | 'personne_confiance'
  | 'had'
  | 'soins_palliatifs'
  | 'infirmiere'
  | 'medecin_traitant'
  | 'autre';

export interface ContactFormData {
  contact_type: ContactType;
  contact_name: string;
  phone_number?: string;
  email?: string;
}

// Types pour les paramètres d'alerte
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

// Types pour les profils d'alerte
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
  phone_number: string;
  whatsapp_number: string;
}

export interface ProfileAlertData {
  alert_contacts: ProfileAlertContact[];
  alert_settings: ProfileAlertSettings;
}
