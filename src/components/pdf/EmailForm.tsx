
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { EmailFormInput } from "./EmailFormInput";
import { EmailFormInfoSection } from "./EmailFormInfoSection";
import { EmailAlerts } from "./EmailAlerts";

interface EmailFormProps {
  pdfUrl: string | null;
  onClose: () => void;
}

export function EmailForm({ pdfUrl, onClose }: EmailFormProps) {
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleEmailSend = async (emailAddress: string) => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF à envoyer",
        variant: "destructive",
      });
      return;
    }

    setApiError(null);
    setSuccess(false);
    setIsSending(true);
    try {
      toast({
        title: "Envoi en cours",
        description: "Préparation de l'envoi du document...",
      });

      console.log("Sending PDF to email:", emailAddress);
      console.log("PDF URL length:", pdfUrl?.length || 0);
      
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
      
      console.log("PDF format prepared for sending, prefix:", cleanPdfUrl.substring(0, 50));
      console.log("Total PDF length after cleaning:", cleanPdfUrl.length);
      
      const { data, error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          pdfUrl: cleanPdfUrl,
          recipientEmail: emailAddress,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        setApiError(`Erreur lors de l'appel à la fonction: ${error.message}`);
        throw new Error(`Erreur lors de l'appel à la fonction: ${error.message}`);
      }

      if (!data) {
        throw new Error("Aucune réponse reçue du serveur");
      }

      if (!data.success) {
        console.error("Function returned error:", data.error);
        if (data.error && data.error.includes("RESEND_API_KEY")) {
          setApiError("La clé d'API pour l'envoi d'emails n'est pas configurée. Veuillez contacter l'administrateur du site.");
        } else if (data.error && data.error.includes("API key is invalid")) {
          setApiError("La clé d'API pour l'envoi d'emails est invalide. Veuillez contacter l'administrateur du site.");
        } else if (data.error && data.error.includes("domain has not been verified")) {
          setApiError("Le domaine d'envoi d'email n'a pas été vérifié. Veuillez contacter l'administrateur du site.");
        } else {
          setApiError(data.error || "Erreur inconnue lors de l'envoi du PDF");
        }
        throw new Error(data.error || "Erreur inconnue lors de l'envoi du PDF");
      }

      setSuccess(true);
      toast({
        title: "Succès",
        description: "Le PDF a été envoyé par email. Vérifiez votre boîte de réception (et dossier spam).",
      });
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
    <div className="flex flex-col space-y-4 mr-auto">
      <EmailAlerts apiError={apiError} success={success} />
      
      <div className="flex flex-col space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <EmailFormInput 
          onSend={handleEmailSend}
          isSending={isSending}
          success={success}
        />
        <EmailFormInfoSection />
      </div>
    </div>
  );
}
