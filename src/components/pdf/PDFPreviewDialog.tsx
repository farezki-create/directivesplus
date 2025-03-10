
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { createPrintWindow } from "./utils/PrintUtils";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail: () => void;
  onSave: () => void;
  onPrint: () => void;
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
    onSave();
    onOpenChange(false);
    navigate("/generate-pdf");
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

    const printWindow = createPrintWindow(pdfUrl);
    if (printWindow) {
      onOpenChange(false);
      navigate("/generate-pdf");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        
        <div className="flex flex-col space-y-4 h-full">
          <div className="flex justify-end space-x-2">
            <EmailForm 
              pdfUrl={pdfUrl} 
              onClose={() => onOpenChange(false)} 
            />
            <PDFActionButtons 
              onDownload={handleDownload} 
              onPrint={handlePrint} 
            />
          </div>
          
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
