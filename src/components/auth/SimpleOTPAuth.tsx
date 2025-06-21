
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Shield, Loader2, ArrowLeft, RefreshCw, Info } from "lucide-react";
import { useSimpleOTPAuth } from "@/hooks/useSimpleOTPAuth";

interface SimpleOTPAuthProps {
  onSuccess?: () => void;
}

const SimpleOTPAuth: React.FC<SimpleOTPAuthProps> = ({ onSuccess }) => {
  const [otpCode, setOtpCode] = useState('');
  const { loading, step, email, sendOTP, verifyOTP, resendCode, goBackToEmail } = useSimpleOTPAuth();

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get('email') as string;
    await sendOTP(emailValue);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyOTP(otpCode);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const handleResendCode = async () => {
    setOtpCode('');
    await resendCode();
  };

  const handleGoBack = () => {
    setOtpCode('');
    goBackToEmail();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {step === 'email' ? (
            <>
              <Mail className="h-5 w-5" />
              Connexion Simple
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
            ? 'Saisissez votre email pour recevoir votre code de connexion'
            : `Code envoyé à ${email}`
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 'email' && (
          <>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Conseil :</strong> Vérifiez vos spams si vous ne recevez pas l'email rapidement.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Mail className="mr-2 h-4 w-4" />
                Envoyer le code
              </Button>
            </form>
          </>
        )}

        {step === 'otp' && (
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
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || otpCode.length !== 6}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
            
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Renvoyer le code
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={handleGoBack}
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
