
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Shield, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OTPAuthFormProps {
  onSuccess?: () => void;
}

interface ApiError {
  success: boolean;
  error?: string;
  message?: string;
}

const OTPAuthForm: React.FC<OTPAuthFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleApiError = (error: any, defaultMessage: string): string => {
    console.error('🔍 [OTP-FORM] Analyse erreur:', error);
    
    if (error?.message?.includes('non-2xx status')) {
      return 'Erreur de communication avec le serveur. Veuillez réessayer.';
    }
    
    if (typeof error === 'object' && error !== null) {
      if (error.error) return error.error;
      if (error.message) return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return defaultMessage;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return;
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Veuillez saisir un email valide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📧 [OTP-FORM] Envoi du code OTP pour:', email);

      const { data, error: functionError } = await supabase.functions.invoke('send-otp', {
        body: { email: email.trim() }
      });

      console.log('📧 [OTP-FORM] Réponse send-otp:', { data, error: functionError });

      if (functionError) {
        const errorMessage = handleApiError(functionError, 'Erreur lors de l\'envoi du code OTP');
        setError(errorMessage);
        return;
      }

      if (data?.success) {
        setStep('otp');
        toast({
          title: "Code envoyé",
          description: "Vérifiez votre boîte email pour le code OTP à 6 chiffres",
        });
        
        // En mode développement, afficher le code dans la console
        if (data.debug?.otp) {
          console.log('🔢 [OTP-FORM] Code OTP (dev mode):', data.debug.otp);
          toast({
            title: "Mode développement",
            description: `Code OTP: ${data.debug.otp}`,
            duration: 15000
          });
        }
      } else {
        const errorMessage = data?.error || 'Erreur lors de l\'envoi du code';
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error('❌ [OTP-FORM] Erreur envoi OTP:', err);
      const errorMessage = handleApiError(err, 'Erreur lors de l\'envoi du code OTP');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Le code OTP doit contenir exactement 6 chiffres');
      return;
    }

    if (!/^\d{6}$/.test(otpCode)) {
      setError('Le code OTP ne doit contenir que des chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 [OTP-FORM] Vérification du code OTP:', otpCode);

      const { data, error: functionError } = await supabase.functions.invoke('verify-otp', {
        body: { 
          email: email.trim(),
          otp_code: otpCode 
        }
      });

      console.log('🔐 [OTP-FORM] Réponse verify-otp:', { data, error: functionError });

      if (functionError) {
        const errorMessage = handleApiError(functionError, 'Erreur lors de la vérification du code');
        setError(errorMessage);
        return;
      }

      if (data?.success && data?.access_token) {
        console.log('✅ [OTP-FORM] Tokens reçus, établissement de la session...');
        
        try {
          // Établir la session avec les tokens reçus
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token
          });

          if (sessionError) {
            console.error('❌ [OTP-FORM] Erreur établissement session:', sessionError);
            setError('Erreur lors de l\'établissement de la session');
            return;
          }

          console.log('✅ [OTP-FORM] Session établie avec succès:', sessionData);

          toast({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté",
          });

          // Petite pause pour laisser le temps à la session de s'établir
          await new Promise(resolve => setTimeout(resolve, 500));

          // Redirection ou callback
          if (onSuccess) {
            onSuccess();
          } else {
            // Force la redirection
            window.location.href = '/profile';
          }
        } catch (sessionErr: any) {
          console.error('❌ [OTP-FORM] Erreur inattendue session:', sessionErr);
          setError('Erreur lors de l\'établissement de la session');
        }
      } else {
        const errorMessage = data?.error || data?.message || 'Code OTP invalide';
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error('❌ [OTP-FORM] Erreur vérification OTP:', err);
      const errorMessage = handleApiError(err, 'Code OTP invalide');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      const { data, error: functionError } = await supabase.functions.invoke('send-otp', {
        body: { email: email.trim() }
      });

      if (functionError) {
        const errorMessage = handleApiError(functionError, 'Erreur lors du renvoi du code');
        setError(errorMessage);
        return;
      }

      if (data?.success) {
        toast({
          title: "Code renvoyé",
          description: "Un nouveau code a été envoyé à votre email",
        });
        
        // En mode développement, afficher le code dans la console
        if (data.debug?.otp) {
          console.log('🔢 [OTP-FORM] Nouveau code OTP (dev mode):', data.debug.otp);
          toast({
            title: "Mode développement",
            description: `Nouveau code OTP: ${data.debug.otp}`,
            duration: 15000
          });
        }
      } else {
        const errorMessage = data?.error || 'Erreur lors du renvoi du code';
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error('❌ [OTP-FORM] Erreur renvoi OTP:', err);
      const errorMessage = handleApiError(err, 'Erreur lors du renvoi du code');
      setError(errorMessage);
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
            <AlertCircle className="h-4 w-4" />
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
                autoComplete="email"
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
