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
        description: "Vérifiez votre boîte email pour le code à 6 chiffres envoyé par Supabase.",
      });

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur envoi OTP Supabase:', err);

      // Supbase Auth gère ses propres rate limits, mais on ne montre plus ces alertes UI
      if (err.status === 429 || err.message?.includes('rate limit') || err.message?.includes('Too many requests')) {
        const newExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min d'attente (interne, non affichée)
        setRateLimitExpiry(newExpiry);
        setError(''); // On ne met aucun message explicite
        // Pas de toast destructif pour la limite
      } else {
        setError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
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
        window.location.href = '/profile';
      }

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur vérification OTP Supabase:', err);
      setError('Code invalide, expiré, ou une erreur est survenue.');
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
    await handleEmailSubmit(new Event('submit') as any as React.FormEvent);
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

        {/* --- SUPPRESSION DU RateLimitDisplay ici --- */}
        {/* Le composant n'est plus affiché :
        <RateLimitDisplay 
          isActive={isRateLimitActive} 
          expiryDate={rateLimitExpiry} 
        />
        */}

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
