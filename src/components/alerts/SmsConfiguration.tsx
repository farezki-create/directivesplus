
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Phone } from 'lucide-react';

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
