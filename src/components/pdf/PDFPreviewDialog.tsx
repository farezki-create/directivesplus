import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  if (!pdfUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <div className="flex justify-end gap-2 mb-4">
          <Button onClick={onEmail} variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button onClick={onSave} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
          <Button onClick={onPrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
        </div>
        <iframe
          src={pdfUrl}
          className="w-full h-full rounded-lg"
          title="PDF Preview"
        />
      </DialogContent>
    </Dialog>
  );
}