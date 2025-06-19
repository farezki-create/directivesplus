
export interface AlertContact {
  id: string;
  patient_id: string;
  contact_type: string;
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

export interface SettingsFormData {
  auto_alert_enabled: boolean;
  alert_threshold: number;
  symptom_types: string[];
}
