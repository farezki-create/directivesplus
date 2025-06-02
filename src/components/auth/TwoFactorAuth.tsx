
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TwoFactorAuthProps {
  userId: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  userId,
  onVerificationComplete,
  onBack
}) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [actualCode, setActualCode] = useState(''); // In production, this would be stored securely

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendSMSCode = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre numéro de téléphone",
        variant: "destructive"
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      toast({
        title: "Erreur",
        description: "Format de numéro de téléphone invalide. Utilisez le format international (+33...)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-sms-code', {
        body: {
          phoneNumber: phoneNumber.replace(/\s/g, ''),
          userId: userId
        }
      });

      if (error) throw error;

      if (data.success) {
        setActualCode(data.code); // In production, don't expose the code
        setStep('code');
        setCountdown(300); // 5 minutes
        toast({
          title: "Code envoyé",
          description: "Un code de vérification a été envoyé à votre téléphone"
        });
      } else {
        throw new Error(data.error || 'Erreur lors de l\'envoi du SMS');
      }
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code SMS",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer le code de vérification",
        variant: "destructive"
      });
      return;
    }

    if (attempts >= 3) {
      toast({
        title: "Trop de tentatives",
        description: "Vous avez dépassé le nombre maximum de tentatives. Veuillez recommencer.",
        variant: "destructive"
      });
      setStep('phone');
      setAttempts(0);
      return;
    }

    setLoading(true);

    try {
      // In production, verify against stored code in database
      if (verificationCode === actualCode) {
        toast({
          title: "Vérification réussie",
          description: "Authentification à deux facteurs validée"
        });
        onVerificationComplete();
      } else {
        setAttempts(prev => prev + 1);
        const remainingAttempts = 3 - attempts - 1;
        toast({
          title: "Code incorrect",
          description: `Code de vérification incorrect. ${remainingAttempts} tentative(s) restante(s).`,
          variant: "destructive"
        });
        setVerificationCode('');
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la vérification du code",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === 'phone') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle>Authentification à deux facteurs</CardTitle>
          <CardDescription>
            Entrez votre numéro de téléphone pour recevoir un code de vérification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <Alert>
            <AlertDescription>
              Assurez-vous d'utiliser le format international (+33 pour la France)
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={loading}
              className="flex-1"
            >
              Retour
            </Button>
            <Button
              onClick={sendSMSCode}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer le code'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-green-600" />
        </div>
        <CardTitle>Vérification SMS</CardTitle>
        <CardDescription>
          Entrez le code de vérification envoyé au {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code de vérification</Label>
          <Input
            id="code"
            type="text"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-lg tracking-widest"
            disabled={loading}
            maxLength={6}
          />
        </div>

        {countdown > 0 && (
          <Alert>
            <AlertDescription>
              Code valide pendant encore {formatTime(countdown)}
            </AlertDescription>
          </Alert>
        )}

        {attempts > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              Tentatives restantes : {3 - attempts}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setStep('phone')}
            disabled={loading}
            className="flex-1"
          >
            Modifier le numéro
          </Button>
          <Button
            onClick={verifyCode}
            disabled={loading || verificationCode.length !== 6}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              'Vérifier'
            )}
          </Button>
        </div>

        {countdown === 0 && (
          <Button
            variant="link"
            onClick={() => setStep('phone')}
            className="w-full"
          >
            Renvoyer un code
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
