import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer, PenTool } from "lucide-react";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail: () => void;
  onSave: () => void;
  onPrint: () => void;
  onSign: () => void;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  pdfUrl,
  onEmail,
  onSave,
  onPrint,
  onSign,
}: PDFPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer par email
            </Button>
            <Button variant="outline" onClick={onSave}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button variant="outline" onClick={onPrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="default" onClick={onSign}>
              <PenTool className="mr-2 h-4 w-4" />
              Signer
            </Button>
          </div>
          
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-[600px] border rounded"
              title="PDF Preview"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}