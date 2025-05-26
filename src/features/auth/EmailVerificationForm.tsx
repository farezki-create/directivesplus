
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, RefreshCw, AlertTriangle, Shield } from "lucide-react";
import { checkAuthAttempt, resetAuthAttempts } from "@/utils/security/authSecurity";

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
  const [maskedCode, setMaskedCode] = useState("");

  const handleCodeChange = (value: string) => {
    setCode(value);
    // Masquer le code saisi pour la sécurité
    setMaskedCode("*".repeat(value.length));
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError("Veuillez saisir un code à 6 chiffres");
      return;
    }

    // Vérifier la protection anti-brute force
    const bruteForceCheck = checkAuthAttempt(email, 'email_verification');
    if (!bruteForceCheck.allowed) {
      setError(`Trop de tentatives. Réessayez dans ${bruteForceCheck.lockoutMinutes} minutes.`);
      toast({
        title: "Vérification bloquée",
        description: `Trop de tentatives de vérification. Réessayez dans ${bruteForceCheck.lockoutMinutes} minutes.`,
        variant: "destructive",
        duration: 8000
      });
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      console.log("Verifying email with code...");
      
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup'
      });

      if (error) {
        console.error("Verification error:", error);
        
        let errorMessage = "Code invalide. Veuillez vérifier et réessayer.";
        
        if (error.message.includes('expired')) {
          errorMessage = "Le code a expiré. Veuillez demander un nouveau code.";
        } else if (error.message.includes('invalid')) {
          errorMessage = "Code invalide. Vérifiez votre saisie.";
        }
        
        setError(errorMessage);
        
        // Afficher un avertissement si peu de tentatives restantes
        if (bruteForceCheck.remainingAttempts <= 1) {
          toast({
            title: "Attention",
            description: `${bruteForceCheck.remainingAttempts} tentative restante avant blocage temporaire.`,
            variant: "destructive",
            duration: 5000
          });
        }
        
        return;
      }

      if (data.user) {
        console.log("Email verification successful");
        
        // Réinitialiser le compteur après succès
        resetAuthAttempts(email, 'email_verification');
        
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
      console.log("Resending verification code...");
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error("Resend error:", error);
        setError("Erreur lors du renvoi du code");
        
        toast({
          title: "Erreur",
          description: "Impossible de renvoyer le code. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Code renvoyé",
        description: "Un nouveau code de vérification a été envoyé à votre email.",
      });
      
      // Effacer le code actuel
      setCode("");
      setMaskedCode("");
      
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
        {/* Alerte de sécurité */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Ce code expire dans 10 minutes. Saisissez-le rapidement pour des raisons de sécurité.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-center block">
              Saisissez le code de vérification
            </label>
            <div className="flex justify-center">
              <InputOTP 
                value={code} 
                onChange={handleCodeChange} 
                maxLength={6}
                className="tracking-widest"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {/* Affichage sécurisé du code saisi */}
            {maskedCode && (
              <div className="text-center">
                <span className="text-xs text-gray-500">Code saisi: {maskedCode}</span>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
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
        
        {/* Conseils de sécurité */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <h4 className="text-xs font-medium text-yellow-800 mb-1">
            Conseils de sécurité :
          </h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Ne partagez jamais ce code avec personne</li>
            <li>• Ce code expire automatiquement pour votre sécurité</li>
            <li>• Vérifiez l'expéditeur de l'email de vérification</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
