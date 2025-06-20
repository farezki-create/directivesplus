
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Phone, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SmsConfigurationProps {
  smsEnabled: boolean;
  smsProvider: 'twilio' | 'whatsapp';
  phoneNumber: string;
  whatsappNumber: string;
  onSmsEnabledChange: (enabled: boolean) => void;
  onProviderChange: (provider: 'twilio' | 'whatsapp') => void;
  onPhoneNumberChange: (phone: string) => void;
  onWhatsappNumberChange: (whatsapp: string) => void;
}

const SmsConfiguration: React.FC<SmsConfigurationProps> = ({
  smsEnabled,
  smsProvider,
  phoneNumber,
  whatsappNumber,
  onSmsEnabledChange,
  onProviderChange,
  onPhoneNumberChange,
  onWhatsappNumberChange
}) => {
  const [testLoading, setTestLoading] = useState(false);

  const handleTestMessage = async () => {
    if (!smsEnabled) {
      toast({
        title: "Configuration requise",
        description: "Veuillez d'abord activer les notifications SMS/WhatsApp",
        variant: "destructive"
      });
      return;
    }

    const targetNumber = smsProvider === 'twilio' ? phoneNumber : whatsappNumber;
    if (!targetNumber?.trim()) {
      toast({
        title: "Numéro manquant",
        description: `Veuillez saisir un numéro ${smsProvider === 'twilio' ? 'de téléphone' : 'WhatsApp'}`,
        variant: "destructive"
      });
      return;
    }

    setTestLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-test-alert', {
        body: {
          sms_provider: smsProvider,
          phone_number: smsProvider === 'twilio' ? phoneNumber : undefined,
          whatsapp_number: smsProvider === 'whatsapp' ? whatsappNumber : undefined,
          message: `Message de test DirectivePlus - ${new Date().toLocaleString('fr-FR')}`
        }
      });

      if (error) {
        console.error('Erreur lors de l\'envoi du message de test:', error);
        toast({
          title: "Erreur d'envoi",
          description: error.message || "Impossible d'envoyer le message de test",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Message envoyé",
        description: data.message || "Message de test envoyé avec succès"
      });

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message de test:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message de test",
        variant: "destructive"
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Configuration SMS/WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sms_enabled">Notifications SMS/WhatsApp</Label>
            <p className="text-sm text-gray-600">
              Recevoir des notifications par SMS ou WhatsApp
            </p>
          </div>
          <Switch
            id="sms_enabled"
            checked={smsEnabled}
            onCheckedChange={onSmsEnabledChange}
          />
        </div>

        {smsEnabled && (
          <>
            <div>
              <Label htmlFor="sms_provider">Type de notification</Label>
              <Select 
                value={smsProvider} 
                onValueChange={onProviderChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      SMS (Twilio)
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {smsProvider === 'twilio' && (
              <div>
                <Label htmlFor="phone_number">Numéro de téléphone</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => onPhoneNumberChange(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Format international requis (ex: +33 6 12 34 56 78)
                </p>
              </div>
            )}

            {smsProvider === 'whatsapp' && (
              <div>
                <Label htmlFor="whatsapp_number">Numéro WhatsApp</Label>
                <Input
                  id="whatsapp_number"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => onWhatsappNumberChange(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Numéro WhatsApp au format international
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <Label>Test de réception</Label>
                <p className="text-sm text-gray-600">
                  Envoyer un message de test pour vérifier la configuration
                </p>
              </div>
              <Button
                onClick={handleTestMessage}
                disabled={testLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {testLoading ? 'Envoi...' : 'Tester'}
              </Button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Information</h4>
                  <p className="text-sm text-blue-700">
                    {smsProvider === 'twilio' 
                      ? 'Les SMS seront envoyés via Twilio. Des frais peuvent s\'appliquer.'
                      : 'Les messages seront envoyés via WhatsApp Business API.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SmsConfiguration;
