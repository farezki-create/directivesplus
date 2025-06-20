
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Settings, Users, MessageSquare, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AlertContactsManager from './AlertContactsManager';
import SmsConfiguration from './SmsConfiguration';

interface AlertSettings {
  auto_alert_enabled: boolean;
  alert_threshold: number;
  symptom_types: string[];
  sms_enabled: boolean;
  sms_provider: 'twilio' | 'whatsapp';
  phone_number: string;
  whatsapp_number: string;
}

const SYMPTOM_OPTIONS = [
  { id: 'douleur', label: 'Douleur' },
  { id: 'dyspnee', label: 'Dyspnée' },
  { id: 'anxiete', label: 'Anxiété/Angoisse' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'sommeil', label: 'Troubles du sommeil' },
  { id: 'nausee', label: 'Nausées/Vomissements' },
  { id: 'appetit', label: 'Perte d\'appétit' }
];

const AlertManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AlertSettings>({
    auto_alert_enabled: false,
    alert_threshold: 7,
    symptom_types: ['douleur', 'dyspnee', 'anxiete'],
    sms_enabled: false,
    sms_provider: 'twilio',
    phone_number: '',
    whatsapp_number: ''
  });

  const fetchSettings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching alert settings:', error);
        return;
      }

      if (data) {
        // Vérifier que sms_provider est valide, sinon utiliser 'twilio' par défaut
        const validProvider = data.sms_provider === 'whatsapp' ? 'whatsapp' : 'twilio';
        
        setSettings({
          auto_alert_enabled: data.auto_alert_enabled || false,
          alert_threshold: data.alert_threshold || 7,
          symptom_types: data.symptom_types || ['douleur', 'dyspnee', 'anxiete'],
          sms_enabled: data.sms_enabled || false,
          sms_provider: validProvider,
          phone_number: data.phone_number || '',
          whatsapp_number: data.whatsapp_number || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('patient_alert_settings')
        .upsert({
          patient_id: user.id,
          auto_alert_enabled: settings.auto_alert_enabled,
          alert_threshold: settings.alert_threshold,
          symptom_types: settings.symptom_types,
          sms_enabled: settings.sms_enabled,
          sms_provider: settings.sms_provider,
          phone_number: settings.phone_number,
          whatsapp_number: settings.whatsapp_number
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder les paramètres d'alerte.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres d'alerte ont été enregistrés avec succès.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Gestion des Alertes
      </h1>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS/WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Paramètres d'alerte automatique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto_alert">Alertes automatiques</Label>
                    <p className="text-sm text-gray-600">
                      Activer les alertes automatiques en cas de symptômes critiques
                    </p>
                  </div>
                  <Switch
                    id="auto_alert"
                    checked={settings.auto_alert_enabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, auto_alert_enabled: checked }))
                    }
                  />
                </div>

                {settings.auto_alert_enabled && (
                  <>
                    <div className="space-y-3">
                      <Label>Seuil d'alerte: {settings.alert_threshold}/10</Label>
                      <Slider
                        value={[settings.alert_threshold]}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, alert_threshold: value[0] }))
                        }
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-600">
                        Une alerte sera déclenchée si un symptôme atteint ou dépasse ce niveau
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Symptômes surveillés</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {SYMPTOM_OPTIONS.map((symptom) => (
                          <div key={symptom.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={symptom.id}
                              checked={settings.symptom_types.includes(symptom.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSettings(prev => ({
                                    ...prev,
                                    symptom_types: [...prev.symptom_types, symptom.id]
                                  }));
                                } else {
                                  setSettings(prev => ({
                                    ...prev,
                                    symptom_types: prev.symptom_types.filter(id => id !== symptom.id)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={symptom.id} className="text-sm">
                              {symptom.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button 
                    onClick={saveSettings} 
                    disabled={saving}
                    className="bg-directiveplus-600 hover:bg-directiveplus-700"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <AlertContactsManager />
        </TabsContent>

        <TabsContent value="sms">
          <SmsConfiguration
            smsEnabled={settings.sms_enabled}
            smsProvider={settings.sms_provider}
            phoneNumber={settings.phone_number}
            whatsappNumber={settings.whatsapp_number}
            onSmsEnabledChange={(enabled) => 
              setSettings(prev => ({ ...prev, sms_enabled: enabled }))
            }
            onProviderChange={(provider) => 
              setSettings(prev => ({ ...prev, sms_provider: provider }))
            }
            onPhoneNumberChange={(phone) => 
              setSettings(prev => ({ ...prev, phone_number: phone }))
            }
            onWhatsappNumberChange={(whatsapp) => 
              setSettings(prev => ({ ...prev, whatsapp_number: whatsapp }))
            }
          />
          <div className="flex justify-end mt-6">
            <Button 
              onClick={saveSettings} 
              disabled={saving}
              className="bg-directiveplus-600 hover:bg-directiveplus-700"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Sauvegarder les paramètres SMS
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertManagement;
