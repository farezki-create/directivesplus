
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSendOTP } from "@/hooks/useSendOTP";
import { generateOTP } from "@/utils/otpGenerator";
import { Loader2, Send, RefreshCw } from "lucide-react";

export const OTPTestComponent = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(generateOTP(6));
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const { sendOTP, isLoading } = useSendOTP();

  const handleGenerateNewCode = () => {
    setCode(generateOTP(6));
  };

  const handleSendOTP = async () => {
    if (!email || !code) {
      return;
    }

    await sendOTP({
      email,
      code,
      firstName: firstName || undefined,
      lastName: lastName || undefined
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Test d'envoi OTP
        </CardTitle>
        <CardDescription>
          Testez l'envoi de codes OTP via Resend
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email destinataire *</Label>
          <Input
            id="email"
            type="email"
            placeholder="test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              placeholder="Jean"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              placeholder="Dupont"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Code OTP</Label>
          <div className="flex gap-2">
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleGenerateNewCode}
              title="Générer un nouveau code"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSendOTP}
          disabled={isLoading || !email || !code}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Envoyer le code OTP
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Le code OTP sera envoyé via Resend</p>
          <p>• Un nouveau code est généré automatiquement</p>
          <p>• Les champs prénom/nom sont optionnels</p>
        </div>
      </CardContent>
    </Card>
  );
};
