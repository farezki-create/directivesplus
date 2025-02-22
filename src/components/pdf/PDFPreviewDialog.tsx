
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer } from "lucide-react";

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
  onEmail,
  onSave,
  onPrint,
}: PDFPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        
        <div className="flex flex-col space-y-4 h-full">
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
          </div>
          
          {pdfUrl ? (
            <div className="flex-1 min-h-[500px] border rounded">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Aucun document à afficher
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
