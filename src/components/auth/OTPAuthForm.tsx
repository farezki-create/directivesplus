
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Shield, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OTPAuthFormProps {
  onSuccess?: () => void;
}

const OTPAuthForm: React.FC<OTPAuthFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📧 Envoi du code OTP pour:', email);

      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: email.trim() }
      });

      console.log('📧 Réponse send-otp:', data, error);

      if (error) {
        console.error('❌ Erreur fonction send-otp:', error);
        
        // Gestion d'erreurs spécifiques
        let errorMessage = 'Erreur lors de l\'envoi du code OTP';
        if (error.message?.includes('non-2xx status')) {
          errorMessage = 'Erreur serveur. Veuillez réessayer dans quelques instants.';
        } else if (error.message?.includes('Email requis')) {
          errorMessage = 'Veuillez saisir un email valide';
        } else if (error.message?.includes('Configuration serveur')) {
          errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.';
        }
        
        setError(errorMessage);
        return;
      }

      if (data?.success) {
        setStep('otp');
        toast({
          title: "Code envoyé",
          description: "Vérifiez votre boîte email pour le code OTP",
        });
        
        // En mode développement, afficher le code dans la console
        if (data.debug?.otp) {
          console.log('🔢 Code OTP (dev mode):', data.debug.otp);
          toast({
            title: "Mode développement",
            description: `Code OTP: ${data.debug.otp}`,
            duration: 10000
          });
        }
      } else {
        throw new Error(data?.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (err: any) {
      console.error('❌ Erreur envoi OTP:', err);
      setError(err.message || 'Erreur lors de l\'envoi du code OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Le code OTP doit contenir 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 Vérification du code OTP:', otpCode);

      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          email: email.trim(),
          otp_code: otpCode 
        }
      });

      console.log('🔐 Réponse verify-otp:', data, error);

      if (error) {
        console.error('❌ Erreur fonction verify-otp:', error);
        
        // Gestion d'erreurs spécifiques
        let errorMessage = 'Code OTP invalide';
        if (error.message?.includes('non-2xx status')) {
          errorMessage = 'Erreur serveur lors de la vérification. Veuillez réessayer.';
        }
        
        setError(errorMessage);
        return;
      }

      if (data?.success && data?.access_token) {
        console.log('✅ Tokens reçus, établissement de la session...');
        
        // Établir la session avec les tokens reçus
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        });

        if (sessionError) {
          console.error('❌ Erreur établissement session:', sessionError);
          setError('Erreur lors de l\'établissement de la session');
          return;
        }

        console.log('✅ Session établie avec succès');

        toast({
          title: "Connexion réussie",
          description: "Redirection vers votre profil",
        });

        // Rediriger vers la page de profil pour compléter les informations
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = '/profile';
        }
      } else {
        setError(data?.message || 'Code OTP invalide');
      }
    } catch (err: any) {
      console.error('❌ Erreur vérification OTP:', err);
      setError(err.message || 'Code OTP invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: email.trim() }
      });

      if (error) {
        console.error('❌ Erreur renvoi OTP:', error);
        setError('Erreur lors du renvoi du code');
        return;
      }

      if (data?.success) {
        toast({
          title: "Code renvoyé",
          description: "Un nouveau code a été envoyé à votre email",
        });
        
        // En mode développement, afficher le code dans la console
        if (data.debug?.otp) {
          console.log('🔢 Nouveau code OTP (dev mode):', data.debug.otp);
          toast({
            title: "Mode développement",
            description: `Nouveau code OTP: ${data.debug.otp}`,
            duration: 10000
          });
        }
      } else {
        throw new Error(data?.error || 'Erreur lors du renvoi du code');
      }
    } catch (err: any) {
      console.error('❌ Erreur renvoi OTP:', err);
      setError(err.message || 'Erreur lors du renvoi du code');
    } finally {
      setResendLoading(false);
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
              Connexion / Inscription
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
            ? 'Saisissez votre email pour recevoir un code de connexion'
            : `Code envoyé à ${email}`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
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
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer le code
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Un compte sera créé automatiquement si vous n'en avez pas.
            </div>
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
                disabled={resendLoading}
                className="w-full"
              >
                {resendLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Renvoyer le code
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

export default OTPAuthForm;
