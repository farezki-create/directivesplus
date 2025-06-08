
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, Key, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EmailVerificationFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

const EmailVerificationForm = ({ email, onSuccess, onBack }: EmailVerificationFormProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'waiting' | 'code-entry'>('waiting');

  const handleConfirmationReceived = async () => {
    setStep('code-entry');
    // Ici, déclencher l'envoi du code de connexion
    try {
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { 
          email, 
          type: 'login_code' 
        }
      });
      
      if (error) {
        setMessage('Erreur lors de l\'envoi du code de connexion');
      } else {
        setMessage('Code de connexion envoyé ! Vérifiez votre email.');
      }
    } catch (error) {
      setMessage('Erreur lors de l\'envoi du code');
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setMessage('Veuillez saisir un code à 6 chiffres');
      return;
    }

    setIsVerifying(true);
    setMessage('');

    try {
      const { data, error } = await supabase.rpc('verify_code', {
        p_email: email,
        p_code: verificationCode,
        p_verification_type: 'login_code'
      });

      if (error) throw error;

      if (data && data.length > 0 && data[0].is_valid) {
        setMessage('Code vérifié avec succès !');
        setTimeout(onSuccess, 1000);
      } else {
        setMessage('Code invalide ou expiré');
      }
    } catch (error: any) {
      setMessage(error.message || 'Erreur lors de la vérification');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) throw error;
      setMessage('Email de confirmation renvoyé !');
    } catch (error: any) {
      setMessage(error.message || 'Erreur lors du renvoi');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {step === 'waiting' ? <Mail className="w-6 h-6" /> : <Key className="w-6 h-6" />}
          {step === 'waiting' ? 'Confirmation Email' : 'Code de Connexion'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {message && (
          <Alert className={message.includes('succès') || message.includes('envoyé') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertDescription className={message.includes('succès') || message.includes('envoyé') ? 'text-green-800' : 'text-red-800'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {step === 'waiting' && (
          <>
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Un email de confirmation a été envoyé à :
                </p>
                <p className="font-medium text-blue-900">{email}</p>
              </div>
              
              <p className="text-sm text-gray-600">
                Cliquez sur le lien de confirmation dans votre email, puis cliquez sur le bouton ci-dessous.
              </p>
              
              <Button 
                onClick={handleConfirmationReceived}
                className="w-full"
                variant="default"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                J'ai confirmé mon email
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleResendConfirmation}
                  disabled={isResending}
                  variant="outline"
                  className="flex-1"
                >
                  {isResending ? 'Renvoi...' : 'Renvoyer'}
                </Button>
                
                <Button 
                  onClick={onBack}
                  variant="ghost"
                  className="flex-1"
                >
                  Retour
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'code-entry' && (
          <>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Saisissez le code à 6 chiffres envoyé à votre email
              </p>
              
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={setVerificationCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <Button 
                onClick={handleVerifyCode}
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full"
              >
                {isVerifying ? 'Vérification...' : 'Vérifier le code'}
              </Button>
              
              <Button 
                onClick={onBack}
                variant="ghost"
                className="w-full"
              >
                Retour à l'inscription
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerificationForm;
