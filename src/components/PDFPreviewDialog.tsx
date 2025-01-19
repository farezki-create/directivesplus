import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer } from "lucide-react";
import { SignaturePad } from "./SignaturePad";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handlePDFDownload } from "./pdf/utils/PDFGenerationUtils";

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
  const { toast } = useToast();

  const handleSignatureSave = (signatureData: string) => {
    console.log("[PDFPreviewDialog] Saving signature");
    localStorage.setItem('userSignature', signatureData);
    setShowSignaturePad(false);
    
    // Regenerate PDF with signature
    console.log("[PDFPreviewDialog] Regenerating PDF with signature");
    onSave();
  };

  const handleDownload = () => {
    console.log("[PDFPreviewDialog] Handling download");
    if (pdfUrl) {
      handlePDFDownload(pdfUrl);
    }
  };

  const isValidPdfUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error("[PDFPreviewDialog] Invalid PDF URL:", url);
      return false;
    }
  };

  const renderPdfPreview = () => {
    if (!pdfUrl) {
      return (
        <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded border">
          <p className="text-muted-foreground">Aucun document à afficher</p>
        </div>
      );
    }

    if (!isValidPdfUrl(pdfUrl)) {
      console.error("[PDFPreviewDialog] Invalid PDF URL detected");
      toast({
        title: "Erreur",
        description: "Impossible d'afficher le document PDF",
        variant: "destructive",
      });
      return (
        <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded border">
          <p className="text-muted-foreground">Erreur lors du chargement du document</p>
        </div>
      );
    }

    return (
      <iframe
        src={pdfUrl}
        className="w-full h-[600px] border rounded"
        title="PDF Preview"
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogTitle>Prévisualisation du document</DialogTitle>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowSignaturePad(true)}>
              Signer le document
            </Button>
            <Button variant="outline" onClick={onEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer par email
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button variant="outline" onClick={onPrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
          
          {showSignaturePad ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Signature électronique</h3>
              <p className="text-sm text-muted-foreground">
                Veuillez signer dans la zone ci-dessous. Vous pouvez recommencer si nécessaire.
              </p>
              <SignaturePad onSave={handleSignatureSave} />
            </div>
          ) : (
            renderPdfPreview()
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}