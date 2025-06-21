
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Shield, AlertCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EmailStep } from "./EmailStep";
import { OTPStep } from "./OTPStep";

interface SimpleOTPAuthProps {
  onSuccess?: () => void;
}

const SimpleOTPAuth: React.FC<SimpleOTPAuthProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitUntil, setRateLimitUntil] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Timer pour afficher le temps restant
  useEffect(() => {
    if (!rateLimitUntil) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(0, rateLimitUntil.getTime() - now);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setRateLimitUntil(null);
        setError('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimitUntil]);

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

    if (rateLimitUntil && new Date() < rateLimitUntil) {
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
        throw signInError;
      }

      setStep('otp');
      toast({
        title: "Code envoyé",
        description: "Vérifiez votre boîte email pour le code à 6 chiffres.",
      });

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur envoi OTP:', err);

      if (err.status === 429 || err.message?.includes('rate limit') || err.message?.includes('Too many requests')) {
        // Rate limit détecté - attendre 2 minutes
        const waitTime = 2 * 60 * 1000;
        setRateLimitUntil(new Date(Date.now() + waitTime));
        setError('');
        
        toast({
          title: "Limite d'envoi atteinte",
          description: "Veuillez patienter 2 minutes avant de réessayer.",
          variant: "destructive",
        });
      } else {
        setError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
        toast({
          title: "Erreur d'envoi",
          description: "Impossible d'envoyer le code. Vérifiez votre email.",
          variant: "destructive",
        });
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
      console.log('🔐 [SIMPLE-OTP] Vérification OTP pour:', email.substring(0, 3) + '***');
      
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'email',
      });

      if (verifyError) {
        throw verifyError;
      }

      if (!data.session) {
        setError('Code invalide ou session non créée. Veuillez réessayer.');
        return;
      }
      
      console.log('✅ [SIMPLE-OTP] Connexion réussie');
      
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
      console.error('❌ [SIMPLE-OTP] Erreur vérification OTP:', err);
      setError('Code invalide ou expiré. Veuillez réessayer.');
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
    await handleEmailSubmit(new Event('submit') as any as React.FormEvent);
  };

  const goBackToEmail = () => {
    setStep('email');
    setOtpCode('');
    setError('');
    setRateLimitUntil(null);
  };

  const isRateLimited = rateLimitUntil && new Date() < rateLimitUntil;
  const remainingMinutes = Math.ceil(timeRemaining / 60000);

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

        {isRateLimited && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Limite d'emails atteinte. Veuillez patienter {remainingMinutes} minute(s).
            </AlertDescription>
          </Alert>
        )}

        {step === 'email' ? (
          <EmailStep
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            loading={loading}
            isRateLimitActive={!!isRateLimited}
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
            isRateLimitActive={!!isRateLimited}
            rateLimitExpiry={rateLimitUntil}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleOTPAuth;
