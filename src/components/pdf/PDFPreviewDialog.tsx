
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { Button } from "@/components/ui/button";
import { Construction, Database } from "lucide-react";
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
  const [validPdfUrl, setValidPdfUrl] = useState<string | null>(null);

  // Vérifier et traiter l'URL du PDF
  useEffect(() => {
    if (open && pdfUrl) {
      try {
        console.log("[PDFPreview] Received PDF URL type:", typeof pdfUrl);
        console.log("[PDFPreview] PDF URL starts with:", pdfUrl.substring(0, 30) + "...");
        
        // Tenter de nettoyer l'URL
        const cleanUrl = pdfUrl.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
        
        if (cleanUrl !== pdfUrl) {
          console.log("[PDFPreview] URL was cleaned, original length:", pdfUrl.length);
        }
        
        setValidPdfUrl(cleanUrl);
      } catch (error) {
        console.error("[PDFPreview] Error processing PDF URL:", error);
        toast({
          title: "Erreur",
          description: "Problème lors du traitement du PDF",
          variant: "destructive",
        });
        setValidPdfUrl(null);
      }
    }
  }, [open, pdfUrl, toast]);

  const handleDownload = () => {
    if (onSave) {
      try {
        onSave();
        onOpenChange(false);
        navigate("/generate-pdf");
      } catch (error) {
        console.error("[PDFPreview] Error during download:", error);
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le document",
          variant: "destructive",
        });
      }
    }
  };

  const handleSendToDMP = () => {
    toast({
      title: "En construction",
      description: "Cette fonctionnalité est en cours de développement",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        
        <div className="flex flex-col space-y-4 h-full">
          <div className="flex flex-wrap justify-between gap-2">
            <EmailForm 
              pdfUrl={validPdfUrl} 
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
          
          <PDFViewer pdfUrl={validPdfUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
