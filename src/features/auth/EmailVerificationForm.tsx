
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, RefreshCw } from "lucide-react";

interface EmailVerificationFormProps {
  email: string;
  onVerificationComplete: () => void;
  onBackToRegister: () => void;
}

export const EmailVerificationForm = ({ 
  email, 
  onVerificationComplete, 
  onBackToRegister 
}: EmailVerificationFormProps) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError("Veuillez saisir un code à 6 chiffres");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup'
      });

      if (error) {
        console.error("Verification error:", error);
        if (error.message.includes('expired')) {
          setError("Le code a expiré. Veuillez demander un nouveau code.");
        } else if (error.message.includes('invalid')) {
          setError("Code invalide. Veuillez vérifier et réessayer.");
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Email vérifié",
          description: "Votre compte a été activé avec succès !",
        });
        onVerificationComplete();
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setError("Une erreur est survenue lors de la vérification");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error("Resend error:", error);
        setError("Erreur lors du renvoi du code");
        return;
      }

      toast({
        title: "Code renvoyé",
        description: "Un nouveau code de vérification a été envoyé à votre email.",
      });
    } catch (error: any) {
      console.error("Resend error:", error);
      setError("Une erreur est survenue lors du renvoi du code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle>Vérifiez votre email</CardTitle>
        <CardDescription>
          Nous avons envoyé un code de vérification à 6 chiffres à :
          <br />
          <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-center block">
              Saisissez le code de vérification
            </label>
            <div className="flex justify-center">
              <InputOTP value={code} onChange={setCode} maxLength={6}>
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

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleVerifyCode}
            disabled={code.length !== 6 || isVerifying}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              "Vérifier le code"
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Vous n'avez pas reçu le code ?
            </p>
            <Button 
              variant="outline" 
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Renvoyer le code
                </>
              )}
            </Button>
          </div>

          <Button 
            variant="ghost" 
            onClick={onBackToRegister}
            className="w-full"
          >
            Retour à l'inscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
