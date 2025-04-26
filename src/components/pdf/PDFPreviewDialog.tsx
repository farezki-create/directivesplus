
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFViewer } from "./PDFViewer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  externalDocumentId?: string | null;
}

const PDFPreviewDialog = ({
  open,
  onOpenChange,
  pdfUrl,
  externalDocumentId
}: PDFPreviewDialogProps) => {
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  
  // Lorsque le dialog s'ouvre ou que l'URL change, traiter l'URL
  useEffect(() => {
    if (open && pdfUrl) {
      // Si c'est une URL de données ou une URL normale, utilisez-la directement
      setProcessedPdfUrl(pdfUrl);
    } else if (!open) {
      // Révoquer l'URL Blob à la fermeture si nécessaire
      if (processedPdfUrl && processedPdfUrl.startsWith('blob:') && processedPdfUrl !== pdfUrl) {
        URL.revokeObjectURL(processedPdfUrl);
        setProcessedPdfUrl(null);
      }
    }
  }, [open, pdfUrl, processedPdfUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[1000px] h-[80vh] sm:h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle>
              Document PDF {externalDocumentId ? `(ID: ${externalDocumentId})` : ''}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-grow p-4 overflow-hidden">
          <PDFViewer pdfUrl={processedPdfUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PDFPreviewDialog };
