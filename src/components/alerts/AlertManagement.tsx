
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, Settings, Users, MessageSquare } from 'lucide-react';
import AlertContactsManager from './AlertContactsManager';
import SmsConfiguration from './SmsConfiguration';
import AlertSettingsSection from './AlertSettingsSection';
import { useAlertSettings } from '@/hooks/alerts/useAlertSettings';

const AlertManagement = () => {
  const { user, isAdmin } = useAuth();
  const {
    settings,
    setSettings,
    loading,
    saving,
    saveSettings
  } = useAlertSettings(user?.id);

  const handleSaveSmsSettings = () => {
    saveSettings();
  };

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
          <AlertSettingsSection
            settings={settings}
            setSettings={setSettings}
            saving={saving}
            onSave={saveSettings}
            isAdmin={isAdmin}
          />
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
              onClick={handleSaveSmsSettings} 
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
