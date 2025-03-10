
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { handlePDFDownload, handlePDFPrint } from "./utils/PDFGenerationUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PDFPreviewDialogProps {
  pdfUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PDFPreviewDialog({ pdfUrl, isOpen, onClose }: PDFPreviewDialogProps) {
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleEmailSend = async (email: string) => {
    try {
      setSendingEmail(true);
      console.log("[PDFPreview] Sending PDF to email:", email);
      
      if (!pdfUrl) {
        console.error("[PDFPreview] No PDF URL available for email");
        throw new Error("Le PDF n'est pas disponible");
      }

      const { error } = await supabase.functions.invoke('send-pdf-email', {
        body: { 
          email,
          pdfUrl
        }
      });
      
      if (error) {
        console.error("[PDFPreview] Error invoking send-pdf-email function:", error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "Le PDF a été envoyé à votre adresse email.",
      });
      
    } catch (error) {
      console.error("[PDFPreview] Error sending email:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le PDF par email.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Prévisualisation du PDF</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <PDFActionButtons 
              onDownload={() => handlePDFDownload(pdfUrl)} 
              onPrint={() => handlePDFPrint(pdfUrl)} 
            />
          </div>
          
          <PDFViewer pdfUrl={pdfUrl} />
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Recevoir par email</h3>
            <EmailForm onSubmit={handleEmailSend} isLoading={sendingEmail} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
