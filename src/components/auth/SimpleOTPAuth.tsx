
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
    onSuccess: () => setStep('otp'),
    onAttemptIncrement: startCooldown,
    onRateLimitError: handleRateLimitError,
    checkCooldown,
    attemptCount
  });

  const otpVerification = useOTPVerification({ onSuccess });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await emailSubmit.submitEmail(email);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await otpVerification.verifyOTP(email, otpCode);
  };

  const handleResendCode = async () => {
    if (!email) {
      emailSubmit.setError("L'adresse email n'est plus disponible. Veuillez recommencer.");
      setStep('email');
      return;
    }
    await emailSubmit.submitEmail(email);
  };

  const goBackToEmail = () => {
    setStep('email');
    setOtpCode('');
    emailSubmit.setError('');
    resetAttemptCount();
  };

  // Get current error from active hook
  const currentError = step === 'email' ? emailSubmit.error : otpVerification.error;
  const currentLoading = step === 'email' ? emailSubmit.loading : otpVerification.loading;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {step === 'email' ? (
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
          {step === 'email' 
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

        {step === 'email' ? (
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
