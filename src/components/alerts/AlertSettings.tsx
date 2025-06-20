
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, AlertTriangle } from 'lucide-react';
import { AlertSettings as AlertSettingsType } from '@/hooks/useAlertContacts';
import SmsConfiguration from './SmsConfiguration';

interface AlertSettingsProps {
  settings: AlertSettingsType | null;
  onSave: (settings: {
    auto_alert_enabled: boolean;
    alert_threshold: number;
    symptom_types: string[];
    sms_enabled: boolean;
    sms_provider: 'twilio' | 'whatsapp';
    phone_number?: string;
    whatsapp_number?: string;
  }) => Promise<boolean>;
}

const SYMPTOM_TYPES = [
  { value: 'douleur', label: 'Douleur' },
  { value: 'dyspnee', label: 'Dyspnée (essoufflement)' },
  { value: 'anxiete', label: 'Anxiété/Angoisse' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'sommeil', label: 'Troubles du sommeil' }
];

const AlertSettings: React.FC<AlertSettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    auto_alert_enabled: settings?.auto_alert_enabled || false,
    alert_threshold: settings?.alert_threshold || 7,
    symptom_types: settings?.symptom_types || ['douleur', 'dyspnee', 'anxiete'],
    sms_enabled: settings?.sms_enabled || false,
    sms_provider: (settings?.sms_provider || 'twilio') as 'twilio' | 'whatsapp',
    phone_number: settings?.phone_number || '',
    whatsapp_number: settings?.whatsapp_number || ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        auto_alert_enabled: settings.auto_alert_enabled,
        alert_threshold: settings.alert_threshold,
        symptom_types: settings.symptom_types,
        sms_enabled: settings.sms_enabled || false,
        sms_provider: (settings.sms_provider || 'twilio') as 'twilio' | 'whatsapp',
        phone_number: settings.phone_number || '',
        whatsapp_number: settings.whatsapp_number || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  const handleSymptomTypeChange = (symptomType: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        symptom_types: [...formData.symptom_types, symptomType]
      });
    } else {
      setFormData({
        ...formData,
        symptom_types: formData.symptom_types.filter(type => type !== symptomType)
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres d'alerte automatique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto_alert">Alertes automatiques</Label>
                <p className="text-sm text-gray-600">
                  Envoyer automatiquement des alertes quand les seuils sont dépassés
                </p>
              </div>
              <Switch
                id="auto_alert"
                checked={formData.auto_alert_enabled}
                onCheckedChange={(checked) => 
                  setFormData({...formData, auto_alert_enabled: checked})
                }
              />
            </div>

            {formData.auto_alert_enabled && (
              <>
                <div>
                  <Label htmlFor="threshold">Seuil d'alerte</Label>
                  <Select 
                    value={formData.alert_threshold.toString()} 
                    onValueChange={(value) => 
                      setFormData({...formData, alert_threshold: parseInt(value)})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 6, 7, 8, 9].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}/10 et plus
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">
                    Une alerte sera envoyée si l'évaluation atteint ou dépasse ce seuil
                  </p>
                </div>

                <div>
                  <Label>Symptômes à surveiller</Label>
                  <div className="mt-2 space-y-3">
                    {SYMPTOM_TYPES.map(symptom => (
                      <div key={symptom.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom.value}
                          checked={formData.symptom_types.includes(symptom.value)}
                          onCheckedChange={(checked) => 
                            handleSymptomTypeChange(symptom.value, checked as boolean)
                          }
                        />
                        <Label htmlFor={symptom.value}>{symptom.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Important</h4>
                      <p className="text-sm text-yellow-700">
                        Les alertes automatiques seront envoyées à tous vos contacts configurés 
                        lorsqu'une évaluation dépasse le seuil défini.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <SmsConfiguration
        smsEnabled={formData.sms_enabled}
        smsProvider={formData.sms_provider}
        phoneNumber={formData.phone_number}
        whatsappNumber={formData.whatsapp_number}
        onSmsEnabledChange={(enabled) => setFormData({...formData, sms_enabled: enabled})}
        onProviderChange={(provider) => setFormData({...formData, sms_provider: provider})}
        onPhoneNumberChange={(phone) => setFormData({...formData, phone_number: phone})}
        onWhatsappNumberChange={(whatsapp) => setFormData({...formData, whatsapp_number: whatsapp})}
      />
    </div>
  );
};

export default AlertSettings;
