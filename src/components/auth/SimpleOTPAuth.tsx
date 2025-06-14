
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
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitExpiry, setRateLimitExpiry] = useState<Date | null>(null);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);

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
          setShowPasswordLogin(true);
          setError('Limite d\'envoi d\'emails atteinte. Veuillez utiliser la connexion par mot de passe ou patienter 5 minutes.');
          toast({
            title: "Limite d'emails atteinte",
            description: "Vous pouvez utiliser la connexion par mot de passe en attendant.",
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Veuillez saisir votre email et mot de passe');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 [PASSWORD-LOGIN] Connexion par mot de passe pour:', email);
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (loginError) {
        console.error('❌ [PASSWORD-LOGIN] Erreur connexion:', loginError);
        
        if (loginError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (loginError.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError(loginError.message);
        }
        return;
      }

      if (data.user) {
        console.log('✅ [PASSWORD-LOGIN] Connexion réussie:', data.user.id);
        
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
      console.error('❌ [PASSWORD-LOGIN] Erreur:', err);
      setError('Erreur de connexion');
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
    setPassword('');
    setError('');
    setShowPasswordLogin(false);
  };

  const switchToPasswordMode = () => {
    setStep('password');
    setError('');
  };

  const switchToEmailMode = () => {
    setStep('email');
    setShowPasswordLogin(false);
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
          ) : step === 'password' ? (
            <>
              <Shield className="h-5 w-5" />
              Connexion par mot de passe
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
            : step === 'password'
            ? 'Saisissez votre mot de passe'
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
              Limite d'emails atteinte. Vous pouvez utiliser la connexion par mot de passe ou patienter {Math.ceil((rateLimitExpiry!.getTime() - Date.now()) / 60000)} minute(s).
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

            {showPasswordLogin && (
              <Button
                type="button"
                variant="outline"
                onClick={switchToPasswordMode}
                className="w-full mt-2"
              >
                <Shield className="mr-2 h-4 w-4" />
                Connexion par mot de passe
              </Button>
            )}
          </form>
        ) : step === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-password">Adresse email</Label>
              <Input
                id="email-password"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="current-password"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={switchToEmailMode}
              className="w-full"
              disabled={isRateLimitActive}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion par email
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
              
              <Button
                type="button"
                variant="ghost"
                onClick={switchToPasswordMode}
                className="w-full"
              >
                <Shield className="mr-2 h-4 w-4" />
                Connexion par mot de passe
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleOTPAuth;
