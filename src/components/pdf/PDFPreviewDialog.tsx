import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerKey, setViewerKey] = useState(0); // Key to force viewer remount
  const [loadError, setLoadError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [localPdfUrl, setLocalPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log("[PDFPreviewDialog] Dialog open state:", open);
    console.log("[PDFPreviewDialog] PDF URL present:", pdfUrl ? "Yes" : "No");
    
    // Set the local PDF URL when the component mounts or when pdfUrl changes
    if (pdfUrl !== localPdfUrl) {
      setLocalPdfUrl(pdfUrl);
    }
    
    if (open && pdfUrl) {
      // Log URL type for debugging
      if (pdfUrl.startsWith('data:')) {
        console.log("[PDFPreviewDialog] URL is a data URL (length: " + pdfUrl.length + ")");
        // Only log a small sample to avoid console flooding
        console.log("[PDFPreviewDialog] Data URL sample:", pdfUrl.substring(0, 100) + "...");
      } else {
        console.log("[PDFPreviewDialog] URL preview:", pdfUrl.substring(0, 100) + "...");
      }
    }
    
    // Force a remount of the viewer when dialog opens
    if (open) {
      setViewerKey(prev => prev + 1);
      setLoadError(false);
      setRetryAttempts(0);
    }
  }, [open, pdfUrl, localPdfUrl]);

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
      
      toast({
        title: "Téléchargement",
        description: "Votre document est en cours de téléchargement.",
      });
      
      // Optional: keep the dialog open or navigate
      // onOpenChange(false);
      // navigate("/generate-pdf");
    }
  };

  const handleLoadError = () => {
    console.log("[PDFPreviewDialog] PDF load error detected, attempt:", retryAttempts + 1);
    
    if (retryAttempts < 2) {
      // Auto-retry a couple of times
      setRetryAttempts(prev => prev + 1);
      setViewerKey(prev => prev + 1);
      
      // Only show error after retries exhausted
      if (retryAttempts === 1) {
        setLoadError(true);
        toast({
          title: "Problème d'affichage",
          description: "Impossible d'afficher le PDF. Vous pouvez essayer de le télécharger directement.",
          variant: "destructive",
        });
      }
    } else {
      setLoadError(true);
    }
  };

  const handleLoadSuccess = () => {
    console.log("[PDFPreviewDialog] PDF loaded successfully");
    setLoadError(false);
  };

  const handleDirectDownload = () => {
    if (localPdfUrl) {
      console.log("[PDFPreviewDialog] Direct download initiated");
      const link = document.createElement('a');
      link.href = localPdfUrl;
      link.download = 'directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement direct",
        description: "Votre document a été téléchargé.",
      });
    }
  };

  const openInNewTab = () => {
    if (localPdfUrl) {
      console.log("[PDFPreviewDialog] Opening PDF in new tab");
      window.open(localPdfUrl, '_blank');
      
      toast({
        title: "Nouvel onglet",
        description: "Votre document a été ouvert dans un nouvel onglet.",
      });
    }
  };

  const handleRetry = () => {
    console.log("[PDFPreviewDialog] Manual retry initiated");
    setViewerKey(prev => prev + 1);
    setLoadError(false);
    setRetryAttempts(0);
    
    toast({
      title: "Nouvelle tentative",
      description: "Tentative de rechargement du PDF...",
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // If no PDF URL is provided, show a message
  if (!localPdfUrl && open) {
    console.error("[PDFPreviewDialog] No PDF URL provided to the dialog");
    
    toast({
      title: "Erreur",
      description: "Aucun document PDF n'a été généré.",
      variant: "destructive",
    });
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
              pdfUrl={localPdfUrl} 
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
            {localPdfUrl ? (
              <PDFViewer 
                key={viewerKey} 
                pdfUrl={localPdfUrl} 
                onLoadError={handleLoadError}
                onLoadSuccess={handleLoadSuccess}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center border rounded p-4">
                <p className="text-center text-gray-500">
                  Aucun document PDF n'a été généré. Veuillez réessayer la génération.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
