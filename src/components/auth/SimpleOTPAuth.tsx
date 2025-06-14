
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Shield, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { EmailStep } from "./EmailStep";
import { OTPStep } from "./OTPStep";
import { RateLimitDisplay } from "./RateLimitDisplay";

interface SimpleOTPAuthProps {
  onSuccess?: () => void;
}

const SimpleOTPAuth: React.FC<SimpleOTPAuthProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitExpiry, setRateLimitExpiry] = useState<Date | null>(null);
  const [isRateLimitActive, setIsRateLimitActive] = useState(false);

  const { handleError, handleAuthError } = useErrorHandler({ 
    component: 'SimpleOTPAuth',
    showToast: false 
  });

  // Mettre à jour le statut de limite en temps réel
  useEffect(() => {
    const updateRateLimitStatus = () => {
      if (rateLimitExpiry) {
        const now = new Date();
        const isActive = now < rateLimitExpiry;
        
        if (isActive !== isRateLimitActive) {
          setIsRateLimitActive(isActive);
          
          if (!isActive) {
            console.log('🕒 [RATE-LIMIT] Délai expiré, réactivation des boutons');
            setRateLimitExpiry(null);
            setError('');
          }
        }
      } else {
        setIsRateLimitActive(false);
      }
    };

    // Vérifier immédiatement
    updateRateLimitStatus();

    // Vérifier toutes les secondes
    const interval = setInterval(updateRateLimitStatus, 1000);

    return () => clearInterval(interval);
  }, [rateLimitExpiry, isRateLimitActive]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Veuillez saisir un email valide');
      return;
    }

    // Vérifier si la limite est encore active
    if (isRateLimitActive && rateLimitExpiry) {
      const remainingTime = rateLimitExpiry.getTime() - Date.now();
      if (remainingTime > 0) {
        const remainingMinutes = Math.ceil(remainingTime / 60000);
        setError(`Veuillez encore patienter ${remainingMinutes} minute(s) avant de réessayer.`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      console.log('📧 [SIMPLE-OTP] Envoi Magic Link pour:', email.substring(0, 3) + '***');
      
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (magicLinkError) {
        await handleAuthError(magicLinkError, 'sendOTP');
        
        if (magicLinkError.message.includes('rate limit') || magicLinkError.message.includes('email rate limit exceeded')) {
          const newExpiry = new Date(Date.now() + 5 * 60 * 1000);
          setRateLimitExpiry(newExpiry);
          setIsRateLimitActive(true);
          setError('Limite d\'envoi d\'emails atteinte. Veuillez patienter 5 minutes avant de réessayer.');
          toast({
            title: "Limite d'emails atteinte",
            description: "Veuillez patienter 5 minutes avant de réessayer.",
            variant: "destructive",
          });
          return;
        }
        
        setError(magicLinkError.message);
        return;
      }

      setStep('otp');
      toast({
        title: "Code envoyé",
        description: "Vérifiez votre boîte email pour le code à 6 chiffres",
      });

    } catch (err: any) {
      await handleError(err, 'sendOTP');
      setError('Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Le code doit contenir exactement 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 [SIMPLE-OTP] Vérification OTP pour:', email.substring(0, 3) + '***');
      
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'email'
      });

      if (verifyError) {
        await handleAuthError(verifyError, 'verifyOTP');
        setError('Code invalide ou expiré');
        return;
      }

      if (data.user) {
        console.log('✅ [SIMPLE-OTP] Connexion réussie pour user:', data.user.id);
        
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });

        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = '/profile';
        }
      }

    } catch (err: any) {
      await handleError(err, 'verifyOTP');
      setError('Erreur de vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isRateLimitActive && rateLimitExpiry) {
      const remainingTime = rateLimitExpiry.getTime() - Date.now();
      if (remainingTime > 0) {
        const remainingMinutes = Math.ceil(remainingTime / 60000);
        toast({
          title: "Limite active",
          description: `Veuillez patienter encore ${remainingMinutes} minute(s)`,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (resendError) {
        await handleAuthError(resendError, 'resendOTP');
        if (resendError.message.includes('rate limit')) {
          const newExpiry = new Date(Date.now() + 5 * 60 * 1000);
          setRateLimitExpiry(newExpiry);
          setIsRateLimitActive(true);
          setError('Limite d\'envoi atteinte. Veuillez patienter 5 minutes.');
        } else {
          setError(resendError.message);
        }
        return;
      }

      toast({
        title: "Code renvoyé",
        description: "Un nouveau code a été envoyé",
      });

    } catch (err: any) {
      await handleError(err, 'resendOTP');
      setError('Erreur lors du renvoi');
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep('email');
    setOtpCode('');
    setError('');
  };

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
            : `Code envoyé à ${email}`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <RateLimitDisplay 
          isActive={isRateLimitActive} 
          expiryDate={rateLimitExpiry} 
        />

        {step === 'email' ? (
          <EmailStep
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            loading={loading}
            isRateLimitActive={isRateLimitActive}
          />
        ) : (
          <OTPStep
            email={email}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            onSubmit={handleOTPSubmit}
            onResendCode={handleResendCode}
            onGoBack={goBackToEmail}
            loading={loading}
            isRateLimitActive={isRateLimitActive}
            rateLimitExpiry={rateLimitExpiry}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleOTPAuth;
