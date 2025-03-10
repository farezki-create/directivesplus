
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
      console.log("PDF URL length:", pdfUrl?.length || 0);
      console.log("PDF URL prefix:", pdfUrl?.substring(0, 50));
      
      // Nettoyage du format PDF
      let cleanPdfUrl = pdfUrl;
      
      // 1. Vérifier un contenu dupliqué
      if (cleanPdfUrl.includes("data:application/pdf;base64,data:application/pdf;base64,")) {
        cleanPdfUrl = cleanPdfUrl.replace("data:application/pdf;base64,data:application/pdf;base64,", "data:application/pdf;base64,");
        console.log("Fixed duplicate prefix");
      }
      
      // 2. Si le format contient "filename", extraire correctement la partie base64
      if (cleanPdfUrl.includes("data:application/pdf;filename=")) {
        const parts = cleanPdfUrl.split(';base64,');
        if (parts.length > 1) {
          cleanPdfUrl = "data:application/pdf;base64," + parts[parts.length - 1];
          console.log("Extracted base64 from filename format");
        }
      }
      
      // 3. Si le préfixe est manquant, l'ajouter
      if (!cleanPdfUrl.startsWith('data:application/pdf;base64,')) {
        cleanPdfUrl = 'data:application/pdf;base64,' + cleanPdfUrl;
        console.log("Added missing prefix");
      }
      
      console.log("PDF format prepared for sending, final prefix:", cleanPdfUrl.substring(0, 50));
      
      const { data, error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          pdfUrl: cleanPdfUrl,
          recipientEmail: emailAddress,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Erreur lors de l'envoi: ${error.message}`);
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
