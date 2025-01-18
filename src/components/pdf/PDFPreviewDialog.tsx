import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFActions } from "./PDFActions";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail: () => void;
  onSave: () => void;
  onPrint: () => void;
}

export const PDFPreviewDialog = ({
  open,
  onOpenChange,
  pdfUrl,
  onEmail,
  onSave,
  onPrint,
}: PDFPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Aperçu du document</DialogTitle>
        </DialogHeader>
        
        {pdfUrl && (
          <div className="space-y-4">
            <iframe
              src={pdfUrl}
              className="w-full h-[600px] border rounded"
              title="Aperçu PDF"
            />
            
            <PDFActions 
              onEmail={onEmail}
              onSave={onSave}
              onPrint={onPrint}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};