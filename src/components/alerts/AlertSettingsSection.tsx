
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Save, Lock, Info } from 'lucide-react';
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
            {!isAdmin && <Lock className="h-4 w-4 text-gray-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info pour tous les utilisateurs */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {isAdmin ? 
                "En tant qu'administrateur, vous pouvez configurer les paramètres d'alerte automatique qui s'appliqueront à tous les utilisateurs." :
                "Ces paramètres d'alerte automatique sont configurés par l'administrateur et s'appliquent à votre compte. Contactez votre administrateur pour toute modification."
              }
            </AlertDescription>
          </Alert>

          {!isAdmin && (
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Seuls les administrateurs peuvent modifier ces paramètres d'alerte automatique.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto_alert" className={!isAdmin ? "text-gray-400" : ""}>
                Alertes automatiques
              </Label>
              <p className={`text-sm ${!isAdmin ? "text-gray-400" : "text-gray-600"}`}>
                Activer les alertes automatiques en cas de symptômes critiques
              </p>
            </div>
            <Switch
              id="auto_alert"
              checked={settings.auto_alert_enabled}
              disabled={!isAdmin}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, auto_alert_enabled: checked }))
              }
            />
          </div>

          {settings.auto_alert_enabled && (
            <>
              <div className="space-y-3">
                <Label className={!isAdmin ? "text-gray-400" : ""}>
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
                  disabled={!isAdmin}
                  className="w-full"
                />
                <p className={`text-sm ${!isAdmin ? "text-gray-400" : "text-gray-600"}`}>
                  Une alerte sera déclenchée si un symptôme atteint ou dépasse ce niveau
                </p>
              </div>

              <div className="space-y-3">
                <Label className={!isAdmin ? "text-gray-400" : ""}>
                  Symptômes surveillés
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {SYMPTOM_OPTIONS.map((symptom) => (
                    <div key={symptom.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom.id}
                        checked={settings.symptom_types.includes(symptom.id)}
                        disabled={!isAdmin}
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
                      <Label 
                        htmlFor={symptom.id} 
                        className={`text-sm ${!isAdmin ? "text-gray-400" : ""}`}
                      >
                        {symptom.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {isAdmin && (
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
                Sauvegarder
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSettingsSection;
