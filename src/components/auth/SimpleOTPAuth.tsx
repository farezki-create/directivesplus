
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Shield, AlertCircle, Clock } from "lucide-react";
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
  const [otpSent, setOtpSent] = useState(false); // Track if OTP was successfully sent

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
      console.log('📧 [SIMPLE-OTP] Email envoyé avec succès, passage à l\'étape OTP');
      setOtpSent(true);
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
    console.log('📧 [SIMPLE-OTP] Tentative envoi email pour:', email.substring(0, 3) + '***');
    await emailSubmit.submitEmail(email);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 [SIMPLE-OTP] Tentative vérification OTP');
    await otpVerification.verifyOTP(email, otpCode);
  };

  const handleResendCode = async () => {
    if (!email) {
      emailSubmit.setError("L'adresse email n'est plus disponible. Veuillez recommencer.");
      setStep('email');
      setOtpSent(false);
      return;
    }
    console.log('🔄 [SIMPLE-OTP] Renvoi du code OTP');
    await emailSubmit.submitEmail(email);
  };

  const goBackToEmail = () => {
    console.log('⬅️ [SIMPLE-OTP] Retour à l\'étape email');
    setStep('email');
    setOtpCode('');
    setOtpSent(false);
    emailSubmit.setError('');
    otpVerification.setError('');
    resetAttemptCount();
  };

  // Determine which step to show - prioritize OTP if it was sent successfully
  const currentStep = otpSent && step === 'otp' ? 'otp' : 'email';

  // Get current error from active hook
  const currentError = currentStep === 'email' ? emailSubmit.error : otpVerification.error;
  const currentLoading = currentStep === 'email' ? emailSubmit.loading : otpVerification.loading;

  console.log('🔍 [SIMPLE-OTP] État actuel:', {
    step: currentStep,
    otpSent,
    email: email.substring(0, 3) + '***',
    cooldownActive,
    attemptCount
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {currentStep === 'email' ? (
            <>
              <Mail className="h-5 w-5" />
              Connexion Sécurisée
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
            ? 'Saisissez votre email pour recevoir un code'
            : `Un code a été envoyé à ${email}`
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        {currentError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{currentError}</AlertDescription>
          </Alert>
        )}

        {cooldownActive && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 flex items-center justify-between">
              <span>Limite atteinte après {attemptCount} tentative(s). Attendre {cooldownSeconds} seconde(s).</span>
              <button
                onClick={resetCooldown}
                className="text-xs underline hover:no-underline ml-2"
                type="button"
              >
                Supprimer limite
              </button>
            </AlertDescription>
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
            rateLimitExpiry={cooldownActive ? new Date(lastSentTime + 60000) : null}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleOTPAuth;
