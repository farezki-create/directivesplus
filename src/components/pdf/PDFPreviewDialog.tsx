
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { Button } from "@/components/ui/button";
import { Construction, Database, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  textContent?: string | null;
  onEmail?: () => void;
  onSave?: () => void;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  pdfUrl,
  textContent,
  onSave,
}: PDFPreviewDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pdfLoadError, setPdfLoadError] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);

  const isTextMode = !!textContent;

  // Reset error state when URL changes or dialog opens
  useEffect(() => {
    if (open && (pdfUrl || textContent)) {
      setPdfLoadError(false);
      setLoadAttempts(0);
      
      if (pdfUrl) {
        console.log("[PDFPreviewDialog] Dialog opened with PDF URL:", 
          pdfUrl?.substring(0, 50) + "...");
      } else if (textContent) {
        console.log("[PDFPreviewDialog] Dialog opened with text content:", 
          textContent?.substring(0, 50) + "...");
      }
    }
  }, [pdfUrl, textContent, open]);

  // Add additional check to validate PDF URL if not in text mode
  useEffect(() => {
    if (!pdfUrl || isTextMode) return;
    
    const isValidUrl = 
      pdfUrl.startsWith('data:') || 
      pdfUrl.startsWith('http://') || 
      pdfUrl.startsWith('https://');
      
    if (!isValidUrl) {
      console.error("[PDFPreviewDialog] Invalid PDF URL format:", pdfUrl.substring(0, 100));
      setPdfLoadError(true);
    }
  }, [pdfUrl, isTextMode]);

  const handleDownload = () => {
    if (isTextMode) {
      // Download as text file
      const element = document.createElement("a");
      const file = new Blob([textContent || ""], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "directives-anticipees.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      onOpenChange(false);
    } else if (onSave) {
      console.log("[PDFPreviewDialog] Initiating PDF download");
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

  const handleRetry = () => {
    setPdfLoadError(false);
    setLoadAttempts(prev => prev + 1);
    
    // Try to regenerate the view by forcing a reload of the PDF
    if (loadAttempts > 2) {
      // After a few attempts, suggest refreshing the page
      toast({
        title: "Problème persistant",
        description: "Essayez de rafraîchir la page complètement",
        variant: "destructive",
      });
    }
  };

  // Verify if PDF URL is valid (only in PDF mode)
  const isPdfUrlValid = !isTextMode && pdfUrl && (
    pdfUrl.startsWith('http') || 
    pdfUrl.startsWith('https') || 
    pdfUrl.startsWith('data:')
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          {isTextMode 
            ? "Votre document texte a été généré. Vous pouvez le télécharger ou l'envoyer par email." 
            : "Votre document PDF a été généré. Vous pouvez le télécharger ou l'envoyer par email."}
        </DialogDescription>
        
        <div className="flex flex-col space-y-4 h-full">
          <div className="flex flex-wrap justify-between gap-2">
            {!isTextMode && (
              <EmailForm 
                pdfUrl={pdfUrl} 
                onClose={() => onOpenChange(false)} 
              />
            )}
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
                isTextMode={isTextMode}
              />
            </div>
          </div>
          
          {pdfLoadError && !isTextMode ? (
            <div className="flex-1 flex items-center justify-center flex-col text-red-500 p-8 border rounded">
              <AlertCircle className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">Erreur de chargement du PDF</h3>
              <p className="text-center mb-4">Le document PDF n'a pas pu être chargé correctement.</p>
              <Button 
                onClick={handleRetry} 
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          ) : (
            <PDFViewer pdfUrl={pdfUrl} textContent={textContent} />
          )}
          
          {!isTextMode && !isPdfUrlValid && pdfUrl && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm">
              Format d'URL de PDF non valide: {pdfUrl.substring(0, 50)}...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
