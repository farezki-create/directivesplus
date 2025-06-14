
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Shield, ArrowLeft, AlertCircle, Clock, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  // Check if rate limit has expired
  const isRateLimitActive = rateLimitExpiry && new Date() < rateLimitExpiry;

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

    setLoading(true);
    setError('');

    try {
      console.log('📧 [SIMPLE-OTP] Envoi Magic Link pour:', email);
      
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (magicLinkError) {
        console.error('❌ [SIMPLE-OTP] Erreur Magic Link:', magicLinkError);
        
        // Handle rate limit specifically
        if (magicLinkError.message.includes('rate limit') || magicLinkError.message.includes('email rate limit exceeded')) {
          // Set rate limit expiry to 5 minutes from now
          setRateLimitExpiry(new Date(Date.now() + 5 * 60 * 1000));
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
      console.error('❌ [SIMPLE-OTP] Erreur:', err);
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
      console.log('🔐 [SIMPLE-OTP] Vérification OTP:', otpCode);
      
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'email'
      });

      if (verifyError) {
        console.error('❌ [SIMPLE-OTP] Erreur vérification:', verifyError);
        setError('Code invalide ou expiré');
        return;
      }

      if (data.user) {
        console.log('✅ [SIMPLE-OTP] Connexion réussie:', data.user.id);
        
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
      console.error('❌ [SIMPLE-OTP] Erreur:', err);
      setError('Erreur de vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isRateLimitActive) {
      const remainingMinutes = Math.ceil((rateLimitExpiry!.getTime() - Date.now()) / 60000);
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
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (resendError) {
        if (resendError.message.includes('rate limit')) {
          setRateLimitExpiry(new Date(Date.now() + 5 * 60 * 1000));
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

        {isRateLimitActive && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Limite d'emails atteinte. Veuillez patienter {Math.ceil((rateLimitExpiry!.getTime() - Date.now()) / 60000)} minute(s).
            </AlertDescription>
          </Alert>
        )}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoComplete="email"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || isRateLimitActive}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer le code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Code de vérification (6 chiffres)</Label>
              <div className="flex justify-center">
                <InputOTP
                  value={otpCode}
                  onChange={setOtpCode}
                  maxLength={6}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading || otpCode.length !== 6}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
            
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={loading || isRateLimitActive}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isRateLimitActive ? (
                  <Clock className="mr-2 h-4 w-4" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {isRateLimitActive 
                  ? `Patienter ${Math.ceil((rateLimitExpiry!.getTime() - Date.now()) / 60000)}min`
                  : 'Renvoyer le code'
                }
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={goBackToEmail}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Changer d'email
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleOTPAuth;
