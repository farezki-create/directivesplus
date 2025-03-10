
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { printPDF } from "./utils/PrintUtils";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

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
      const success = printPDF(pdfUrl);
      if (success) {
        onOpenChange(false);
        navigate("/generate-pdf");
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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        
        <div className="flex flex-col space-y-4 h-full">
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
          
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
