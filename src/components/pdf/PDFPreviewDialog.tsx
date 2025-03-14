
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { Button } from "@/components/ui/button";
import { Construction, Database, Printer } from "lucide-react";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail?: () => void;
  onSave?: () => void;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  pdfUrl,
  onSave,
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

  const handleSendToDMP = () => {
    toast({
      title: "En construction",
      description: "Cette fonctionnalité est en cours de développement",
    });
  };

  const handlePrint = () => {
    if (pdfUrl) {
      // Open the PDF in a new window and trigger print
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      } else {
        toast({
          title: "Erreur d'impression",
          description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez que les popups sont autorisés.",
          variant: "destructive",
        });
      }
    }
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
                <Construction className="mr-2 h-4 w-4" />
                Envoyer à votre DMP
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center"
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <PDFActionButtons 
                onDownload={handleDownload} 
              />
            </div>
          </div>
          
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
