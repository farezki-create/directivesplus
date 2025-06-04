
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { use2FA } from "../hooks/use2FA";

interface TwoFactorFormProps {
  email: string;
  userId: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const TwoFactorForm = ({ email, userId, onSuccess, onBack }: TwoFactorFormProps) => {
  const [code, setCode] = useState("");
  const { isLoading, verifyTwoFactorCode, sendTwoFactorCode } = use2FA();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      return;
    }

    const result = await verifyTwoFactorCode(code);
    
    if (result.success) {
      onSuccess();
    }
  };

  const handleResendCode = async () => {
    setCode("");
    await sendTwoFactorCode(email, userId);
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Code de sécurité
        </CardTitle>
        <CardDescription className="text-center">
          Saisissez le code à 6 chiffres envoyé à {maskedEmail}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50">
          <Mail className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-1">
              <p className="font-medium">Code envoyé par email</p>
              <p className="text-sm">Le code expire dans 10 minutes. Vérifiez vos spams si nécessaire.</p>
            </div>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <InputOTP 
              value={code} 
              onChange={setCode}
              maxLength={6}
              disabled={isLoading}
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

          <Button 
            disabled={isLoading || code.length !== 6} 
            type="submit" 
            className="w-full"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Vérification..." : "Valider le code"}
          </Button>
        </form>

        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            onClick={handleResendCode}
            disabled={isLoading}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Renvoyer le code
          </Button>

          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Vous ne recevez pas le code ? Vérifiez vos spams ou contactez le support.
        </p>
      </CardContent>
    </Card>
  );
};
