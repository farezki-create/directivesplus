
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
  const [lastSentTime, setLastSentTime] = useState<number>(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (!cooldownActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastSentTime;
      const remainingTime = Math.max(0, 60000 - timeElapsed); // 1 minute cooldown
      
      if (remainingTime <= 0) {
        setCooldownActive(false);
        setCooldownSeconds(0);
        setError('');
      } else {
        setCooldownSeconds(Math.ceil(remainingTime / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownActive, lastSentTime]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    
    // Check local cooldown (1 minute between requests)
    if (now - lastSentTime < 60000) {
      const remainingSeconds = Math.ceil((60000 - (now - lastSentTime)) / 1000);
      setError(`Veuillez patienter ${remainingSeconds} secondes avant de renvoyer un code.`);
      return;
    }

    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Veuillez saisir un email valide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📧 [SIMPLE-OTP] Tentative envoi OTP pour:', email.substring(0, 3) + '***');
      
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

      // Success - set cooldown and proceed to OTP step
      setLastSentTime(now);
      setCooldownActive(true);
      setStep('otp');
      
      toast({
        title: "Code envoyé",
        description: "Vérifiez votre boîte email pour le code à 6 chiffres.",
      });

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur envoi OTP:', err);

      if (err.status === 429 || err.message?.includes('rate limit') || err.message?.includes('Too many requests')) {
        // Set longer cooldown for rate limit
        setLastSentTime(now);
        setCooldownActive(true);
        setError('');
        
        toast({
          title: "Limite d'envoi atteinte",
          description: "Trop de demandes récentes. Veuillez patienter 1 minute.",
          variant: "destructive",
        });
      } else {
        setError('Erreur lors de l\'envoi du code. Vérifiez votre email et réessayez.');
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
    setCooldownActive(false);
    setCooldownSeconds(0);
  };

  const resetCooldown = () => {
    setCooldownActive(false);
    setCooldownSeconds(0);
    setLastSentTime(0);
    setError('');
    toast({
      title: "Cooldown supprimé",
      description: "Vous pouvez maintenant renvoyer un code.",
    });
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

        {cooldownActive && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 flex items-center justify-between">
              <span>Limite atteinte. Attendre {cooldownSeconds} seconde(s).</span>
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
            loading={loading}
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
            loading={loading}
            isRateLimitActive={cooldownActive}
            rateLimitExpiry={cooldownActive ? new Date(lastSentTime + 60000) : null}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleOTPAuth;
