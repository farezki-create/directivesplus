
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

  // Calculer si la limite est active en temps réel
  const isRateLimitActive = rateLimitExpiry ? currentTime < rateLimitExpiry : false;

  // Mettre à jour l'heure actuelle toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Nettoyer l'état quand la limite expire
  useEffect(() => {
    if (rateLimitExpiry && currentTime >= rateLimitExpiry) {
      console.log('🕒 [RATE-LIMIT] Délai expiré, réactivation des boutons');
      setRateLimitExpiry(null);
      setError('');
    }
  }, [currentTime, rateLimitExpiry]);

  const generateOTPCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendEmailViaBrevo = async (email: string, otpCode: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = session?.access_token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dHFxam5lY2V6a3h5aG1tanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTc5MjUsImV4cCI6MjA1Mjc3MzkyNX0.uocoNg-le-iv0pw7c99mthQ6gxGHyXGyQqgxo9_3CPc";

      const response = await fetch(
        "https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/send-auth-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authHeader}`,
          },
          body: JSON.stringify({
            email: email,
            type: 'otp',
            user_data: {
              otp_code: otpCode
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur envoi email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ [BREVO] Email envoyé avec succès:', result);
      return { success: true };
    } catch (error) {
      console.error('❌ [BREVO] Erreur envoi email:', error);
      throw error;
    }
  };

  const storeOTPInDatabase = async (email: string, otpCode: string) => {
    try {
      // Supprimer les anciens codes pour cet email
      await supabase
        .from('user_otp')
        .delete()
        .eq('email', email);

      // Insérer le nouveau code
      const { error } = await supabase
        .from('user_otp')
        .insert([{
          email: email,
          otp_code: otpCode,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        }]);

      if (error) throw error;
      console.log('✅ [DATABASE] Code OTP stocké avec succès');
    } catch (error) {
      console.error('❌ [DATABASE] Erreur stockage OTP:', error);
      throw error;
    }
  };

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

    // Vérifier la limite en temps réel
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
      console.log('📧 [SIMPLE-OTP] Génération et envoi OTP pour:', email.substring(0, 3) + '***');
      
      // Générer un code OTP
      const otpCode = generateOTPCode();
      
      // Stocker le code en base
      await storeOTPInDatabase(email.trim(), otpCode);
      
      // Envoyer l'email via Brevo
      await sendEmailViaBrevo(email.trim(), otpCode);

      setStep('otp');
      toast({
        title: "Code envoyé",
        description: "Vérifiez votre boîte email pour le code à 6 chiffres",
      });

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur:', err);
      
      if (err.message?.includes('rate limit') || err.message?.includes('email rate limit exceeded')) {
        const newExpiry = new Date(Date.now() + 5 * 60 * 1000);
        setRateLimitExpiry(newExpiry);
        setError('Limite d\'envoi d\'emails atteinte. Veuillez patienter 5 minutes avant de réessayer.');
        toast({
          title: "Limite d'emails atteinte",
          description: "Veuillez patienter 5 minutes avant de réessayer.",
          variant: "destructive",
        });
      } else {
        setError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
        await handleError(err, 'sendOTP');
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
      
      // Vérifier le code OTP en base
      const { data: otpData, error: otpError } = await supabase
        .from('user_otp')
        .select('*')
        .eq('email', email.trim())
        .eq('otp_code', otpCode)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (otpError || !otpData) {
        setError('Code invalide ou expiré');
        return;
      }

      // Marquer le code comme utilisé
      await supabase
        .from('user_otp')
        .update({ used: true })
        .eq('id', otpData.id);

      // Créer ou connecter l'utilisateur avec Supabase OTP
      const { data, error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true
        }
      });

      if (signInError) {
        console.error('❌ [SIMPLE-OTP] Erreur connexion:', signInError);
        setError('Erreur lors de la connexion');
        return;
      }

      console.log('✅ [SIMPLE-OTP] Connexion réussie');
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/profile';
      }

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur vérification:', err);
      await handleError(err, 'verifyOTP');
      setError('Erreur de vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    const now = new Date();
    if (rateLimitExpiry && now < rateLimitExpiry) {
      const remainingTime = rateLimitExpiry.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingTime / 60000);
      toast({
        title: "Limite active",
        description: `Veuillez patienter encore ${remainingMinutes} minute(s)`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Générer un nouveau code OTP
      const otpCode = generateOTPCode();
      
      // Stocker le nouveau code en base
      await storeOTPInDatabase(email.trim(), otpCode);
      
      // Envoyer l'email via Brevo
      await sendEmailViaBrevo(email.trim(), otpCode);

      toast({
        title: "Code renvoyé",
        description: "Un nouveau code a été envoyé",
      });

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur renvoi:', err);
      
      if (err.message?.includes('rate limit')) {
        const newExpiry = new Date(Date.now() + 5 * 60 * 1000);
        setRateLimitExpiry(newExpiry);
        setError('Limite d\'envoi atteinte. Veuillez patienter 5 minutes.');
      } else {
        setError('Erreur lors du renvoi');
        await handleError(err, 'resendOTP');
      }
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
