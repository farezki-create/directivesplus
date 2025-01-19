import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer } from "lucide-react";
import { SignaturePad } from "../SignaturePad";
import { useState } from "react";

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
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const handleSignatureSave = (signatureData: string) => {
    // Store the signature data in localStorage for now
    localStorage.setItem('userSignature', signatureData);
    setShowSignaturePad(false);
    
    // Regenerate PDF with signature
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowSignaturePad(true)}>
              Signer le document
            </Button>
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
          
          {showSignaturePad ? (
            <SignaturePad onSave={handleSignatureSave} />
          ) : (
            pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-[600px] border rounded"
                title="PDF Preview"
              />
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}