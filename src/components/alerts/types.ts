
export interface AlertSettings {
  auto_alert_enabled: boolean;
  alert_threshold: number;
  symptom_types: string[];
  sms_enabled: boolean;
  sms_provider: 'twilio' | 'whatsapp';
  phone_number: string;
  whatsapp_number: string;
}

export const SYMPTOM_OPTIONS = [
  { id: 'douleur', label: 'Douleur' },
  { id: 'dyspnee', label: 'Dyspnée' },
  { id: 'anxiete', label: 'Anxiété/Angoisse' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'sommeil', label: 'Troubles du sommeil' },
  { id: 'nausee', label: 'Nausées/Vomissements' },
  { id: 'appetit', label: 'Perte d\'appétit' }
];
