
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
  const [currentTime, setCurrentTime] = useState(new Date());

  const { handleError, handleAuthError } = useErrorHandler({ 
    component: 'SimpleOTPAuth',
    showToast: false 
  });

  const isRateLimitActive = rateLimitExpiry ? currentTime < rateLimitExpiry : false;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (rateLimitExpiry && currentTime >= rateLimitExpiry) {
      console.log('🕒 [RATE-LIMIT] Délai expiré, réactivation des boutons');
      setRateLimitExpiry(null);
      setError('');
    }
  }, [currentTime, rateLimitExpiry]);

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

    const now = new Date();
    if (rateLimitExpiry && now < rateLimitExpiry) {
      const remainingTime = rateLimitExpiry.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingTime / 60000);
      setError(`Veuillez encore patienter ${remainingMinutes} minute(s) avant de réessayer.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📧 [SIMPLE-OTP] Demande OTP via Supabase pour:', email.substring(0, 3) + '***');
      
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true, // Crée l'utilisateur s'il n'existe pas
          emailRedirectTo: `${window.location.origin}/profile`, // Important pour certains flux, même si non utilisé directement ici
        },
      });

      if (signInError) {
        throw signInError;
      }

      setStep('otp');
      toast({
        title: "Code envoyé",
        description: "Vérifiez votre boîte email pour le code à 6 chiffres envoyé par Supabase.",
      });

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur envoi OTP Supabase:', err);
      
      // Supabase Auth gère ses propres rate limits, l'erreur peut contenir des informations
      if (err.status === 429 || err.message?.includes('rate limit') || err.message?.includes('Too many requests')) {
        const newExpiry = new Date(Date.now() + 5 * 60 * 1000); // Standard 5 min wait
        setRateLimitExpiry(newExpiry);
        setError('Trop de tentatives. Veuillez patienter 5 minutes avant de réessayer.');
        toast({
          title: "Limite d'envois atteinte",
          description: "Veuillez patienter 5 minutes avant de réessayer.",
          variant: "destructive",
        });
      } else {
        setError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
        await handleAuthError({ error: err, operation: 'signInWithOtp', showToast: true });
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
        type: 'email', // ou 'sms' si vous utilisez le téléphone, ici c'est 'email'
      });

      if (verifyError) {
        throw verifyError;
      }

      if (!data.session) {
        setError('Code invalide ou session non créée. Veuillez réessayer.');
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
        // Redirection vers la page de profil par exemple, ou la page d'origine
        // window.location.href = data.session.user.user_metadata.emailRedirectTo || '/profile';
        // Pour le moment, on force vers /profile pour simplifier
        window.location.href = '/profile';
      }

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur vérification OTP Supabase:', err);
      setError('Code invalide, expiré, ou une erreur est survenue.');
      await handleAuthError({ error: err, operation: 'verifyOtp', showToast: true, toastMessage: 'Code invalide ou expiré. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Pour renvoyer le code, on relance simplement le processus handleEmailSubmit
    // Assurez-vous que l'email est toujours disponible
    if (!email) {
      setError("L'adresse email n'est plus disponible. Veuillez recommencer.");
      setStep('email');
      return;
    }
    // Simuler un submit pour renvoyer, qui réutilise la logique de rate limit etc.
    await handleEmailSubmit(new Event('submit') as any as React.FormEvent);
  };

  const goBackToEmail = () => {
    setStep('email');
    setOtpCode('');
    // setEmail(''); // Optionnel: garder l'email ou le vider
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
            isRateLimitActive={isRateLimitActive} // Ce rate limit est pour l'UI, Supabase a ses propres limites
            rateLimitExpiry={rateLimitExpiry}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleOTPAuth;
