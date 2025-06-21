
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Shield, AlertCircle, Info } from "lucide-react";
import { EmailStep } from "./EmailStep";
import { OTPStep } from "./OTPStep";
import { useOTPCooldown } from "./hooks/useOTPCooldown";
import { useOTPEmailSubmit } from "./hooks/useOTPEmailSubmit";
import { useOTPVerification } from "./hooks/useOTPVerification";

interface SimpleOTPAuthProps {
  onSuccess?: () => void;
}

const SimpleOTPAuth: React.FC<SimpleOTPAuthProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [emailSentSuccessfully, setEmailSentSuccessfully] = useState(false);

  const {
    attemptCount,
    cooldownActive,
    cooldownSeconds,
    lastSentTime,
    startCooldown,
    handleRateLimitError,
    resetCooldown,
    checkCooldown,
    resetAttemptCount
  } = useOTPCooldown();

  const emailSubmit = useOTPEmailSubmit({
    onSuccess: () => {
      console.log('📧 [AUTH-OTP] Email envoyé avec succès, passage à l\'étape OTP');
      setEmailSentSuccessfully(true);
      setStep('otp');
    },
    onAttemptIncrement: startCooldown,
    onRateLimitError: handleRateLimitError,
    checkCooldown,
    attemptCount
  });

  const otpVerification = useOTPVerification({ onSuccess });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📧 [AUTH-OTP] Tentative envoi email pour:', email.substring(0, 3) + '***');
    await emailSubmit.submitEmail(email);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 [AUTH-OTP] Tentative vérification OTP');
    await otpVerification.verifyOTP(email, otpCode);
  };

  const handleResendCode = async () => {
    if (!email) {
      emailSubmit.setError("L'adresse email n'est plus disponible. Veuillez recommencer.");
      setStep('email');
      setEmailSentSuccessfully(false);
      return;
    }
    console.log('🔄 [AUTH-OTP] Renvoi du code OTP');
    await emailSubmit.submitEmail(email);
  };

  const goBackToEmail = () => {
    console.log('⬅️ [AUTH-OTP] Retour à l\'étape email');
    setStep('email');
    setOtpCode('');
    setEmailSentSuccessfully(false);
    emailSubmit.setError('');
    otpVerification.setError('');
    resetAttemptCount();
  };

  const currentStep = emailSentSuccessfully ? 'otp' : 'email';
  const currentError = currentStep === 'email' ? emailSubmit.error : otpVerification.error;
  const currentLoading = currentStep === 'email' ? emailSubmit.loading : otpVerification.loading;

  console.log('🔍 [AUTH-OTP] État actuel:', {
    step: currentStep,
    emailSentSuccessfully,
    email: email.substring(0, 3) + '***',
    attemptCount
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {currentStep === 'email' ? (
            <>
              <Mail className="h-5 w-5" />
              Connexion Simple
            </>
          ) : (
            <>
              <Shield className="h-5 w-5" />
              Code de vérification
            </>
          )}
        </CardTitle>
        <CardDescription>
          {currentStep === 'email' 
            ? 'Saisissez votre email pour recevoir votre code de connexion'
            : `Code envoyé à ${email}`
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        {currentStep === 'email' && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Conseil :</strong> Vérifiez vos spams si vous ne recevez pas l'email rapidement.
            </AlertDescription>
          </Alert>
        )}

        {currentError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{currentError}</AlertDescription>
          </Alert>
        )}

        {currentStep === 'email' ? (
          <EmailStep
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            loading={currentLoading}
            isRateLimitActive={cooldownActive}
          />
        ) : (
          <OTPStep
            email={email}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            onSubmit={handleOTPSubmit}
            onResendCode={handleResendCode}
            onGoBack={goBackToEmail}
            loading={currentLoading}
            isRateLimitActive={cooldownActive}
            rateLimitExpiry={null}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleOTPAuth;
