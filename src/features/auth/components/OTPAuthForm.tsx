
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Phone, Shield } from "lucide-react";
import { useOTPAuth } from "../hooks/useOTPAuth";

interface OTPAuthFormProps {
  onSuccess?: (user?: any) => void;
}

export const OTPAuthForm: React.FC<OTPAuthFormProps> = ({ onSuccess }) => {
  const { isLoading, step, target, channel, sendCode, verifyCode, resetFlow } = useOTPAuth();
  const [inputValue, setInputValue] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');

  const handleSendCode = async () => {
    if (!inputValue.trim()) return;
    
    // Validation basique
    if (activeTab === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        return;
      }
    } else {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(inputValue.replace(/\s/g, ''))) {
        return;
      }
    }

    await sendCode(inputValue, activeTab);
  };

  const handleVerifyCode = async () => {
    if (otpCode.length !== 6) return;
    
    const result = await verifyCode(otpCode);
    if (result.success && onSuccess) {
      onSuccess(result.user);
    }
  };

  if (step === 'verify') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-directiveplus-600" />
          </div>
          <CardTitle>Vérification du code</CardTitle>
          <CardDescription>
            Entrez le code envoyé à {target}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-code">Code de vérification</Label>
            <Input
              id="otp-code"
              type="text"
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              disabled={isLoading}
              maxLength={6}
            />
          </div>

          <Alert>
            <AlertDescription>
              Code valide pendant 10 minutes
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetFlow}
              disabled={isLoading}
              className="flex-1"
            >
              Retour
            </Button>
            <Button
              onClick={handleVerifyCode}
              disabled={isLoading || otpCode.length !== 6}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                'Vérifier'
              )}
            </Button>
          </div>

          <Button
            variant="link"
            onClick={() => sendCode(target, channel)}
            className="w-full"
            disabled={isLoading}
          >
            Renvoyer le code
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Connexion sécurisée</CardTitle>
        <CardDescription>
          Recevez un code de vérification par email ou SMS
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'email' | 'sms')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              SMS
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.fr"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={handleSendCode}
              disabled={isLoading || !inputValue}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer le code par email'
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="sms" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Alert>
              <AlertDescription>
                Utilisez le format international (+33 pour la France)
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={handleSendCode}
              disabled={isLoading || !inputValue}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer le code par SMS'
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
