
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface EmailFormInputProps {
  onSend: (email: string) => Promise<void>;
  isSending: boolean;
  success: boolean;
}

export function EmailFormInput({ onSend, isSending, success }: EmailFormInputProps) {
  const [emailAddress, setEmailAddress] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSendClick = async () => {
    if (!emailAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    await onSend(emailAddress);
    setEmailAddress("");
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        id="email"
        type="email"
        placeholder="example@email.com"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        className="w-full sm:w-64"
      />
      <Button 
        variant={success ? "outline" : "default"} 
        onClick={handleSendClick}
        disabled={isSending}
        className={success ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" : ""}
      >
        {success ? <CheckCircle className="mr-2 h-4 w-4" /> : <Mail className="mr-2 h-4 w-4" />}
        {isSending ? "Envoi..." : success ? "Renvoi" : "Envoyer"}
      </Button>
    </div>
  );
}
