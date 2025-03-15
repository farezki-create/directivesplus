
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { Button } from "@/components/ui/button";
import { Construction, Database, AlertCircle } from "lucide-react";
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
  const [pdfLoadError, setPdfLoadError] = useState<boolean>(false);

  // Réinitialiser l'état d'erreur quand pdfUrl change
  useEffect(() => {
    if (pdfUrl) {
      setPdfLoadError(false);
      console.log("[PDFPreviewDialog] New PDF URL received:", pdfUrl?.substring(0, 100) + "...");
    }
  }, [pdfUrl]);

  const handleDownload = () => {
    if (onSave) {
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

  // Vérifier si l'URL du PDF est valide
  const isPdfUrlValid = pdfUrl && (
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
        
        <div className="flex flex-col space-y-4 h-full">
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
          
          {pdfLoadError ? (
            <div className="flex-1 flex items-center justify-center flex-col text-red-500 p-8 border rounded">
              <AlertCircle className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">Erreur de chargement du PDF</h3>
              <p className="text-center mb-4">Le document PDF n'a pas pu être chargé correctement.</p>
              <Button 
                onClick={() => setPdfLoadError(false)} 
                variant="outline"
              >
                Réessayer
              </Button>
            </div>
          ) : (
            <PDFViewer pdfUrl={pdfUrl} />
          )}
          
          {!isPdfUrlValid && pdfUrl && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm">
              Format d'URL de PDF non valide: {pdfUrl.substring(0, 50)}...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
