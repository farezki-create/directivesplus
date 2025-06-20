
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
