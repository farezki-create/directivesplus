
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Save, Info } from 'lucide-react';
import { AlertSettings, SYMPTOM_OPTIONS } from './types';

interface AlertSettingsSectionProps {
  settings: AlertSettings;
  setSettings: React.Dispatch<React.SetStateAction<AlertSettings>>;
  saving: boolean;
  onSave: () => void;
  isAdmin: boolean;
}

const AlertSettingsSection: React.FC<AlertSettingsSectionProps> = ({
  settings,
  setSettings,
  saving,
  onSave,
  isAdmin
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Paramètres d'alerte automatique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Configurez vos paramètres d'alerte automatique pour être averti en cas de symptômes critiques.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto_alert">
                Alertes automatiques
              </Label>
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
                <Label>
                  Seuil d'alerte: {settings.alert_threshold}/10
                </Label>
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
                <Label>
                  Symptômes surveillés
                </Label>
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
              onClick={onSave} 
              disabled={saving}
              className="bg-directiveplus-600 hover:bg-directiveplus-700"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Sauvegarder les paramètres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSettingsSection;
