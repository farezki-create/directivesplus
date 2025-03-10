
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { createPrintWindow } from "./utils/PrintUtils";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { cleanupPDFResources } from "./utils/PDFGenerationUtils";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  pdfUrl,
  onSave,
  onPrint,
}: PDFPreviewDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Nettoyer les ressources lorsque le dialog se ferme
  useEffect(() => {
    if (!open && pdfUrl && pdfUrl.startsWith('blob:')) {
      // Attendre un moment pour s'assurer que le PDF n'est plus utilisé
      const timer = setTimeout(() => {
        cleanupPDFResources(pdfUrl);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [open, pdfUrl]);

  // Add logging to help debug PDF generation issues
  useEffect(() => {
    if (open && pdfUrl) {
      console.log("[PDFPreviewDialog] Preview opened with PDF URL:", pdfUrl.substring(0, 30) + "...");
    }
  }, [open, pdfUrl]);

  const handleDownload = () => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF à télécharger",
        variant: "destructive",
      });
      return;
    }
    
    console.log("[PDFPreviewDialog] Download requested");
    if (onSave) {
      onSave();
      // Don't close the dialog or navigate away
    }
  };

  const handlePrint = () => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF à imprimer",
        variant: "destructive",
      });
      return;
    }

    console.log("[PDFPreviewDialog] Print requested");
    if (onPrint) {
      onPrint();
    } else {
      const printWindow = createPrintWindow(pdfUrl);
      if (!printWindow) {
        toast({
          title: "Erreur",
          description: "Impossible d'ouvrir la fenêtre d'impression",
          variant: "destructive",
        });
      }
    }
  };

  const handleSendToDMP = () => {
    toast({
      title: "Information",
      description: "L'envoi vers le DMP sera bientôt disponible",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <DialogTitle className="text-lg font-semibold">
          Prévisualisation du document
        </DialogTitle>
        
        <div className="flex flex-col space-y-4 flex-1 overflow-hidden">
          <div className="flex flex-wrap justify-between gap-2">
            <EmailForm 
              pdfUrl={pdfUrl} 
              onClose={() => {}} // Don't close the dialog
            />
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={handleSendToDMP}
                className="flex items-center"
              >
                <Database className="mr-2 h-4 w-4" />
                Envoyer au DMP
              </Button>
              <PDFActionButtons 
                onDownload={handleDownload} 
                onPrint={handlePrint} 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <PDFViewer pdfUrl={pdfUrl} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
