
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useSecure2FA = () => {
  const [currentStep, setCurrentStep] = useState<'setup' | 'verification' | 'success'>('setup');
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms'>('email');
  const [expectedCode, setExpectedCode] = useState('');

  const handleVerificationSent = (method: 'email' | 'sms', code: string) => {
    setVerificationMethod(method);
    setExpectedCode(code);
    setCurrentStep('verification');
    
    toast({
      title: "Code envoyé",
      description: `Un code de vérification a été envoyé par ${method === 'email' ? 'email' : 'SMS'}`,
      duration: 5000
    });
  };

  const handleVerificationSuccess = () => {
    setCurrentStep('success');
    
    toast({
      title: "Vérification réussie",
      description: "Votre identité a été confirmée avec succès",
      duration: 4000
    });
  };

  const resetToSetup = () => {
    setCurrentStep('setup');
    setExpectedCode('');
  };

  return {
    currentStep,
    verificationMethod,
    expectedCode,
    handleVerificationSent,
    handleVerificationSuccess,
    resetToSetup
  };
};
