
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
  const [otpSent, setOtpSent] = useState(false);

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

  // Determine which step to show
  const currentStep = otpSent && step === 'otp' ? 'otp' : 'email';

  // Get current error and loading state
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
        {currentError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{currentError}</AlertDescription>
          </Alert>
        )}

        {cooldownActive && (
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 flex items-center justify-between">
              <span>Merci de patienter {cooldownSeconds} seconde(s) avant le prochain envoi.</span>
              <button
                onClick={resetCooldown}
                className="text-xs underline hover:no-underline ml-2 text-blue-600"
                type="button"
              >
                Continuer maintenant
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Message d'aide pour les utilisateurs */}
        {attemptCount > 2 && !cooldownActive && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Conseil :</strong> Vérifiez votre boîte de réception ET vos spams. 
              Le code peut prendre quelques minutes à arriver.
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
            rateLimitExpiry={cooldownActive ? new Date(lastSentTime + 30000) : null}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleOTPAuth;
