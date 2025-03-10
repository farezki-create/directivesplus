
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { createPrintWindow } from "./utils/PrintUtils";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Log l'URL du PDF pour débogage
    console.log("[PDFPreviewDialog] PDF URL:", pdfUrl);
    
    return () => setIsMounted(false);
  }, [pdfUrl]);

  const handleDownload = () => {
    if (onSave) {
      onSave();
      onOpenChange(false);
      navigate("/generate-pdf");
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

    if (onPrint) {
      onPrint();
    } else {
      createPrintWindow(pdfUrl);
    }
  };

  const handleSendToDMP = () => {
    toast({
      title: "Information",
      description: "L'envoi vers le DMP sera bientôt disponible",
    });
  };

  // Vérification de sécurité pour l'URL du PDF
  const isValidPdfUrl = pdfUrl && (
    pdfUrl.startsWith('data:application/pdf') || 
    pdfUrl.startsWith('blob:') ||
    pdfUrl.startsWith('http')
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        
        <div className="flex flex-col space-y-4 h-full overflow-hidden">
          <div className="flex flex-wrap justify-between gap-2">
            <EmailForm 
              pdfUrl={pdfUrl} 
              onClose={() => onOpenChange(false)} 
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
          
          <div className="flex-1 overflow-hidden">
            {!isValidPdfUrl && isMounted ? (
              <div className="flex-1 flex items-center justify-center text-red-500">
                Le document PDF n'est pas disponible ou son format n'est pas valide
              </div>
            ) : (
              <PDFViewer pdfUrl={pdfUrl} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
