
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";
import { validateOTPFormat } from "@/utils/otpGenerator";

interface ConfirmationCodeInputProps {
  email: string;
  onConfirm: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const ConfirmationCodeInput = ({ 
  email, 
  onConfirm, 
  onResend, 
  isLoading = false,
  error 
}: ConfirmationCodeInputProps) => {
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTPFormat(code, 6)) {
      return;
    }
    
    await onConfirm(code);
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Mail className="h-8 w-8 text-directiveplus-600" />
        </div>
        <CardTitle>Confirmez votre email</CardTitle>
        <CardDescription>
          Un code de confirmation a été envoyé à<br />
          <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code de confirmation</Label>
            <Input
              id="code"
              type="text"
              placeholder="000000"
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              className="text-center text-lg font-mono tracking-wider"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 text-center">
              Saisissez le code à 6 chiffres reçu par email
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmer
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-directiveplus-600 hover:text-directiveplus-700 underline disabled:opacity-50"
              >
                {isResending ? "Envoi en cours..." : "Renvoyer le code"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>• Vérifiez vos spams si vous ne recevez pas l'email</p>
          <p>• Le code expire dans 10 minutes</p>
        </div>
      </CardContent>
    </Card>
  );
};
