
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
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: email.trim() }
      });

      if (error) throw error;

      if (data?.success) {
        setStep('otp');
        toast({
          title: "Code envoyé",
          description: "Vérifiez votre boîte email pour le code OTP",
        });
      } else {
        throw new Error(data?.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (err: any) {
      console.error('Erreur envoi OTP:', err);
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
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          email: email.trim(),
          otp_code: otpCode 
        }
      });

      if (error) throw error;

      if (data?.success && data?.auth_url) {
        // Utiliser l'URL d'authentification pour établir la session
        window.location.href = data.auth_url;
      } else {
        throw new Error(data?.message || 'Code OTP invalide');
      }
    } catch (err: any) {
      console.error('Erreur vérification OTP:', err);
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

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Code renvoyé",
          description: "Un nouveau code a été envoyé à votre email",
        });
      } else {
        throw new Error(data?.error || 'Erreur lors du renvoi du code');
      }
    } catch (err: any) {
      console.error('Erreur renvoi OTP:', err);
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
              Connexion par email
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
