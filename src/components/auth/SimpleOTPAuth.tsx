
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Shield, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { EmailStep } from "./EmailStep";
import { OTPStep } from "./OTPStep";
import { useRateLimitTimer } from "./useRateLimitTimer";

interface SimpleOTPAuthProps {
  onSuccess?: () => void;
}

const SimpleOTPAuth: React.FC<SimpleOTPAuthProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    rateLimitExpiry,
    isActive: isRateLimitActive,
    start: startRateLimit,
    reset: resetRateLimit,
  } = useRateLimitTimer();

  const { handleError, handleAuthError } = useErrorHandler({ 
    component: 'SimpleOTPAuth',
    showToast: false 
  });

  useEffect(() => {
    if (rateLimitExpiry && new Date() >= rateLimitExpiry) {
      resetRateLimit();
      setError('');
    }
  }, [rateLimitExpiry, resetRateLimit]);

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

    if (isRateLimitActive) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📧 [SIMPLE-OTP] Demande OTP via Supabase pour:', email.substring(0, 3) + '***');
      
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/profile`,
        },
      });

      if (signInError) {
        console.error('Erreur Supabase signInWithOtp:', signInError);
        throw signInError;
      }

      setStep('otp');
      toast({
        title: "Code envoyé",
        description: "Vérifiez votre boîte email pour le code à 6 chiffres.",
      });

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur envoi OTP Supabase:', err);

      if (err.status === 429 || err.message?.includes('rate limit') || err.message?.includes('Too many requests')) {
        startRateLimit(5 * 60 * 1000);
        setError('Trop de tentatives. Veuillez patienter 5 minutes.');
      } else if (err.message?.includes('Signup is disabled')) {
        setError('Les inscriptions sont temporairement désactivées.');
      } else if (err.message?.includes('Email rate limit')) {
        startRateLimit(2 * 60 * 1000);
        setError('Limite d\'envoi d\'emails atteinte. Patientez 2 minutes.');
      } else {
        setError('Erreur lors de l\'envoi du code. Vérifiez votre email et réessayez.');
        await handleAuthError(err, 'signInWithOtp');
      }
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
      console.log('🔐 [SIMPLE-OTP] Vérification OTP via Supabase pour:', email.substring(0, 3) + '***');
      
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'email',
      });

      if (verifyError) {
        console.error('Erreur verification OTP:', verifyError);
        throw verifyError;
      }

      if (!data.session) {
        setError('Code invalide. Veuillez réessayer.');
        return;
      }
      
      console.log('✅ [SIMPLE-OTP] Connexion réussie via Supabase OTP', data.session.user.id);
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/profile';
      }

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur vérification OTP Supabase:', err);
      
      if (err.message?.includes('Token has expired')) {
        setError('Le code a expiré. Demandez un nouveau code.');
        setStep('email');
      } else if (err.message?.includes('Invalid token')) {
        setError('Code invalide. Vérifiez et réessayez.');
      } else {
        setError('Erreur de vérification. Réessayez.');
      }
      
      await handleAuthError(err, 'verifyOtp');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("L'adresse email n'est plus disponible. Veuillez recommencer.");
      setStep('email');
      return;
    }
    setOtpCode('');
    await handleEmailSubmit(new Event('submit') as any as React.FormEvent);
  };

  const goBackToEmail = () => {
    setStep('email');
    setOtpCode('');
    setError('');
    resetRateLimit();
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
            : `Un code a été envoyé à ${email}`
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
