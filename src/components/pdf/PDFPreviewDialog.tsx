
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { EmailSection } from "./preview/EmailSection";
import { ActionButtons } from "./preview/ActionButtons";
import { PreviewContent } from "./preview/PreviewContent";
import { usePrintHandler } from "./preview/PrintHandler";

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
  const navigate = useNavigate();

  const handleDialogClose = () => {
    onOpenChange(false);
    navigate("/generate-pdf");
  };

  const handleDownload = () => {
    onSave();
    handleDialogClose();
  };

  const { handlePrint } = usePrintHandler({ 
    pdfUrl, 
    onNavigate: () => handleDialogClose() 
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        
        <div className="flex flex-col space-y-4 h-full">
          <div className="flex justify-end space-x-2">
            <EmailSection 
              pdfUrl={pdfUrl} 
              onEmailSent={handleDialogClose} 
            />
            <ActionButtons 
              onDownload={handleDownload} 
              onPrint={handlePrint} 
            />
          </div>
          
          <PreviewContent pdfUrl={pdfUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
