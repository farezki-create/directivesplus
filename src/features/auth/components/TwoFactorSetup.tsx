
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail, Phone, Loader2 } from "lucide-react";
import { useAwsEmail } from "@/hooks/useAwsEmail";
import { useAwsSms } from "@/hooks/useAwsSms";

interface TwoFactorSetupProps {
  userEmail: string;
  onVerificationSent: (method: 'email' | 'sms', code: string) => void;
}

export const TwoFactorSetup = ({ userEmail, onVerificationSent }: TwoFactorSetupProps) => {
  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  
  const { sendEmail, isSending: isEmailSending } = useAwsEmail();
  const { sendSMS, isSending: isSmsSending } = useAwsSms();
  
  const isSending = isEmailSending || isSmsSending;

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendVerification = async () => {
    setError('');
    const verificationCode = generateVerificationCode();
    
    try {
      if (method === 'email') {
        await sendEmail({
          to: userEmail,
          subject: "Code de vérification DirectivesPlus",
          type: 'confirmation',
          confirmationUrl: `${window.location.origin}/auth?code=${verificationCode}`,
          userName: userEmail
        });
        onVerificationSent('email', verificationCode);
      } else {
        if (!phoneNumber) {
          setError('Veuillez saisir votre numéro de téléphone');
          return;
        }
        
        await sendSMS({
          phoneNumber: phoneNumber,
          message: `Votre code de vérification DirectivesPlus : ${verificationCode}`,
          type: 'verification'
        });
        onVerificationSent('sms', verificationCode);
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi du code de vérification');
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle>Vérification de sécurité</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div>
          <Label className="text-sm font-medium">Choisissez votre méthode de vérification :</Label>
          <RadioGroup value={method} onValueChange={(value: 'email' | 'sms') => setMethod(value)} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                <Mail className="h-4 w-4" />
                Email ({userEmail})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sms" id="sms" />
              <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                <Phone className="h-4 w-4" />
                SMS
              </Label>
            </div>
          </RadioGroup>
        </div>

        {method === 'sms' && (
          <div>
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        <Button 
          onClick={handleSendVerification} 
          disabled={isSending}
          className="w-full"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            `Envoyer le code par ${method === 'email' ? 'email' : 'SMS'}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
