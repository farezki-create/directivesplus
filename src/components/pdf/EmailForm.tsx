
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle, Info, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmailFormProps {
  pdfUrl: string | null;
  onClose: () => void;
}

export function EmailForm({ pdfUrl, onClose }: EmailFormProps) {
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

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
      
      // Ensure PDF URL is in the correct format
      let cleanPdfUrl = pdfUrl;
      if (cleanPdfUrl && !cleanPdfUrl.startsWith('data:application/pdf;base64,')) {
        cleanPdfUrl = 'data:application/pdf;base64,' + cleanPdfUrl;
      }

      const { data, error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          pdfUrl: cleanPdfUrl,
          recipientEmail: emailAddress,
        },
      });

      console.log("Function response:", data, error);

      if (error) {
        console.error("Supabase function error:", error);
        setApiError(`Erreur lors de l'appel à la fonction: ${error.message}`);
        toast({
          title: "Erreur",
          description: `Erreur lors de l'appel à la fonction: ${error.message}`,
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      if (!data || !data.success) {
        const errorMsg = data?.error || "Erreur inconnue lors de l'envoi du PDF";
        console.error("Function returned error:", errorMsg, data);
        
        if (errorMsg.includes("RESEND_API_KEY")) {
          setApiError("La clé d'API pour l'envoi d'emails n'est pas configurée. Veuillez contacter l'administrateur du site.");
        } else if (errorMsg.includes("base64")) {
          setApiError("Le format du PDF est invalide. Veuillez regénérer le document et réessayer.");
        } else {
          setApiError(errorMsg);
        }
        
        toast({
          title: "Erreur d'envoi",
          description: errorMsg,
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      setSuccess(true);
      toast({
        title: "Email envoyé",
        description: "L'email a été envoyé. Vérifiez votre boîte de réception et votre dossier spam.",
        variant: "default",
      });
      
      setEmailAddress("");
    } catch (error: any) {
      console.error("Error sending email:", error);
      setApiError(`Erreur: ${error.message}`);
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
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur d'envoi</AlertTitle>
          <AlertDescription className="text-sm">{apiError}</AlertDescription>
          <AlertDescription className="text-sm mt-2">
            Vérifiez que:
            <ul className="list-disc pl-5 mt-1">
              <li>Le document PDF a été correctement généré</li>
              <li>La clé d'API Resend est correctement configurée</li>
              <li>L'adresse email est correcte</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Email envoyé avec succès!</AlertTitle>
          <AlertDescription className="text-sm">
            Vérifiez votre boîte de réception. Si vous ne recevez pas l'email dans les 5 minutes, vérifiez:
            <ul className="list-disc pl-5 mt-1">
              <li>Votre dossier spam/indésirables</li>
              <li>L'adresse email saisie: <strong>{emailAddress || "(non saisie)"}</strong></li>
              <li>L'email sera envoyé depuis <strong>onboarding@resend.dev</strong></li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <div className="flex-1 min-w-[200px]">
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full"
              disabled={isSending}
            />
          </div>
          <Button 
            variant={success ? "outline" : "default"} 
            onClick={handleEmailSend}
            disabled={isSending}
            className={success ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" : ""}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {success ? "Renvoyer" : "Envoyer"}
              </>
            )}
          </Button>
        </div>
        <div className="flex flex-col space-y-2 text-xs text-muted-foreground mt-1">
          <p className="flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Vérifiez également votre dossier spam après l'envoi
          </p>
          <p className="flex items-center">
            <Info className="h-3 w-3 mr-1" />
            L'email sera envoyé depuis onboarding@resend.dev
          </p>
        </div>
      </div>
    </div>
  );
}
