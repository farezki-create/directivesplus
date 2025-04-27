
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFViewer } from "./PDFViewer";

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
  
  // Process PDF URL when dialog opens or URL changes
  useEffect(() => {
    if (open && pdfUrl) {
      // Use the URL directly if it's a data URL or a normal URL
      setProcessedPdfUrl(pdfUrl);
    } else if (!open) {
      // Revoke Blob URL when closing if necessary
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
            {/* Close button is now handled by Shadcn UI Dialog component */}
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
