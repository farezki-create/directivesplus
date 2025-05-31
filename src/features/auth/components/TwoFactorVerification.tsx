
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

interface TwoFactorVerificationProps {
  method: 'email' | 'sms';
  expectedCode: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export const TwoFactorVerification = ({ 
  method, 
  expectedCode, 
  onVerificationSuccess, 
  onBack 
}: TwoFactorVerificationProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleVerify = () => {
    if (code === expectedCode) {
      setError('');
      onVerificationSuccess();
    } else {
      setAttempts(prev => prev + 1);
      setError('Code incorrect. Veuillez réessayer.');
      setCode('');
      
      if (attempts >= 2) {
        setError('Trop de tentatives incorrectes. Veuillez recommencer.');
      }
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setError('');
    
    // Vérification automatique quand le code est complet
    if (value.length === 6) {
      setTimeout(() => {
        if (value === expectedCode) {
          onVerificationSuccess();
        } else {
          setAttempts(prev => prev + 1);
          setError('Code incorrect. Veuillez réessayer.');
          setCode('');
        }
      }, 100);
    }
  };

  if (attempts >= 3) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle>Trop de tentatives</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            Vous avez fait trop de tentatives incorrectes. Veuillez recommencer le processus de vérification.
          </p>
          <Button onClick={onBack} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Recommencer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle>Code de vérification</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Saisissez le code de 6 chiffres envoyé par {method === 'email' ? 'email' : 'SMS'}
          </p>
          
          <div className="flex justify-center mb-4">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={handleCodeChange}
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

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button onClick={onBack} variant="outline" className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          
          <Button 
            onClick={handleVerify}
            disabled={code.length !== 6}
            className="flex-1"
          >
            Vérifier
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Tentatives restantes : {3 - attempts}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
