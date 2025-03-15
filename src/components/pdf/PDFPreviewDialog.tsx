
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { Button } from "@/components/ui/button";
import { Construction, Database, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";

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
    }
  }, [open, pdfUrl]);

  // Handle dialog close
  useEffect(() => {
    if (!open) {
      // Reset fullscreen when dialog closes
      setIsFullscreen(false);
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

  const handleSendToDMP = () => {
    toast({
      title: "En construction",
      description: "Cette fonctionnalité est en cours de développement",
    });
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
        <DialogTitle className="text-lg font-semibold mb-4 flex justify-between items-center">
          <span>Prévisualisation du document</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
            className="ml-4"
          >
            {isFullscreen ? (
              <><Minimize2 className="h-4 w-4 mr-2" />Réduire</>
            ) : (
              <><Maximize2 className="h-4 w-4 mr-2" />Agrandir</>
            )}
          </Button>
        </DialogTitle>
        
        <div className="flex flex-col space-y-4 h-full overflow-hidden">
          <div className="flex flex-wrap justify-between gap-2">
            <EmailForm 
              pdfUrl={pdfUrl} 
              onClose={() => onOpenChange(false)} 
            />
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={handleSendToDMP}
                className="flex items-center"
              >
                <Database className="mr-2 h-4 w-4" />
                <Construction className="mr-2 h-4 w-4" />
                Envoyer à votre DMP
              </Button>
              <PDFActionButtons 
                onDownload={handleDownload} 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <PDFViewer key={viewerKey} pdfUrl={pdfUrl} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
