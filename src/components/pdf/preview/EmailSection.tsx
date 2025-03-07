
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface EmailSectionProps {
  pdfUrl: string | null;
  onEmailSent: () => void;
}

export function EmailSection({ pdfUrl, onEmailSent }: EmailSectionProps) {
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSend = async () => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF à envoyer",
        variant: "destructive",
      });
      return;
    }

    if (!emailAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          pdfUrl,
          recipientEmail: emailAddress,
        },
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le PDF a été envoyé par email",
      });
      setEmailAddress("");
      onEmailSent();
      navigate("/generate-pdf");
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le PDF par email",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 mr-auto">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="example@email.com"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        className="w-64"
      />
      <Button 
        variant="outline" 
        onClick={handleEmailSend}
        disabled={isSending}
      >
        <Mail className="mr-2 h-4 w-4" />
        {isSending ? "Envoi..." : "Envoyer par email"}
      </Button>
    </div>
  );
}
