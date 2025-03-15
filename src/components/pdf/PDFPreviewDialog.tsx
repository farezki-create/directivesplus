
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFViewer } from "./PDFViewer";
import { useEffect, useState } from "react";
import { DialogHeader } from "./DialogHeader";
import { PDFActionContainer } from "./PDFActionContainer";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail?: () => void;
  onSave?: () => void;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  pdfUrl,
  onSave,
}: PDFPreviewDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerKey, setViewerKey] = useState(0); // Key to force viewer remount
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    console.log("[PDFPreviewDialog] Dialog open state:", open);
    console.log("[PDFPreviewDialog] PDF URL present:", pdfUrl ? "Yes" : "No");
    
    if (open && pdfUrl) {
      // Log URL type for debugging
      if (pdfUrl.startsWith('data:')) {
        console.log("[PDFPreviewDialog] URL is a data URL (length: " + pdfUrl.length + ")");
        console.log("[PDFPreviewDialog] Data URL sample:", pdfUrl.substring(0, 100) + "...");
      } else {
        console.log("[PDFPreviewDialog] URL preview:", pdfUrl.substring(0, 100) + "...");
      }
    }
    
    // Force a remount of the viewer when dialog opens
    if (open) {
      setViewerKey(prev => prev + 1);
      setLoadError(false);
    }
  }, [open, pdfUrl]);

  // Handle dialog close
  useEffect(() => {
    if (!open) {
      // Reset fullscreen when dialog closes
      setIsFullscreen(false);
      setLoadError(false);
    }
  }, [open]);

  // Force remount of viewer when fullscreen changes
  useEffect(() => {
    setViewerKey(prev => prev + 1);
  }, [isFullscreen]);

  const handleDownload = () => {
    if (onSave) {
      console.log("[PDFPreviewDialog] Handling download");
      onSave();
      onOpenChange(false);
      navigate("/generate-pdf");
    }
  };

  const handleLoadError = () => {
    console.log("[PDFPreviewDialog] PDF load error detected");
    setLoadError(true);
  };

  const handleLoadSuccess = () => {
    console.log("[PDFPreviewDialog] PDF loaded successfully");
    setLoadError(false);
  };

  const handleDirectDownload = () => {
    if (pdfUrl) {
      console.log("[PDFPreviewDialog] Direct download initiated");
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openInNewTab = () => {
    if (pdfUrl) {
      console.log("[PDFPreviewDialog] Opening PDF in new tab");
      window.open(pdfUrl, '_blank');
    }
  };

  const handleRetry = () => {
    console.log("[PDFPreviewDialog] Retrying PDF load");
    setViewerKey(prev => prev + 1);
    setLoadError(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // If no PDF URL is provided, show a message
  if (!pdfUrl && open) {
    console.error("[PDFPreviewDialog] No PDF URL provided to the dialog");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`
          ${isFullscreen ? 'w-[95vw] max-w-none h-[95vh]' : 'w-full max-w-6xl max-h-[90vh]'} 
          flex flex-col p-6 overflow-hidden
        `}
      >
        <DialogHeader 
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
        
        <div className="flex flex-col space-y-4 h-full overflow-hidden">
          <div className="flex flex-wrap justify-between gap-2">
            <EmailForm 
              pdfUrl={pdfUrl} 
              onClose={() => onOpenChange(false)} 
            />
            
            <PDFActionContainer 
              onDownload={handleDownload}
              loadError={loadError}
              onRetry={handleRetry}
              onDirectDownload={handleDirectDownload}
              onOpenInNewTab={openInNewTab}
            />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <PDFViewer 
              key={viewerKey} 
              pdfUrl={pdfUrl} 
              onLoadError={handleLoadError}
              onLoadSuccess={handleLoadSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
