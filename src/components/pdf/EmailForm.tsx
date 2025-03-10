
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface EmailFormProps {
  pdfUrl: string | null;
  onClose: () => void;
}

export function EmailForm({ pdfUrl, onClose }: EmailFormProps) {
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

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

    setIsSending(true);
    try {
      toast({
        title: "Envoi en cours",
        description: "Préparation de l'envoi du document...",
      });

      console.log("Sending PDF to email:", emailAddress);
      console.log("PDF URL type:", typeof pdfUrl);
      console.log("PDF URL starts with:", pdfUrl.substring(0, 30) + "...");
      
      // Fix the PDF URL format if needed
      let formattedPdfUrl = pdfUrl;
      if (!pdfUrl.startsWith('data:application/pdf;base64,')) {
        // If we have a PDF with a different format, we need to inform the user
        if (pdfUrl.includes('blob:') || pdfUrl.includes('http')) {
          throw new Error("Format de PDF non supporté pour l'envoi par email. Veuillez régénérer le PDF.");
        }
        // Try to fix the format if it's missing the prefix but contains base64 data
        formattedPdfUrl = 'data:application/pdf;base64,' + pdfUrl;
        console.log("Reformatted PDF URL with correct prefix");
      }
      
      const { data, error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          pdfUrl: formattedPdfUrl,
          recipientEmail: emailAddress,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Erreur lors de l'appel à la fonction: ${error.message}`);
      }

      if (!data) {
        throw new Error("Aucune réponse reçue du serveur");
      }

      toast({
        title: "Succès",
        description: "Le PDF a été envoyé par email. Vérifiez votre boîte de réception (et dossier spam).",
      });
      
      setEmailAddress("");
      onClose();
      navigate("/generate-pdf");
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur",
        description: `Impossible d'envoyer le PDF par email: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 mr-auto">
      <Label htmlFor="email">{t('email')}</Label>
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
