
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmailForm } from "./EmailForm";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { Button } from "@/components/ui/button";
import { Construction, Database } from "lucide-react";
import { useEffect } from "react";

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

  useEffect(() => {
    console.log("[PDFPreviewDialog] Dialog open state:", open);
    console.log("[PDFPreviewDialog] PDF URL present:", pdfUrl ? "Yes" : "No");
    
    if (pdfUrl) {
      // Check if it's a data URL and log relevant information
      if (pdfUrl.startsWith('data:')) {
        console.log("[PDFPreviewDialog] URL is a data URL");
        console.log("[PDFPreviewDialog] Data URL length:", pdfUrl.length);
        
        if (pdfUrl.startsWith('data:application/pdf;base64,')) {
          console.log("[PDFPreviewDialog] URL appears to be a valid PDF data URL");
          
          // Log the size of the base64 data
          const base64Data = pdfUrl.split(',')[1];
          if (base64Data) {
            console.log("[PDFPreviewDialog] Base64 data length:", base64Data.length);
          }
        } else {
          console.warn("[PDFPreviewDialog] Data URL doesn't seem to be a PDF data URL");
        }
      } else {
        // Log the first 100 characters of the URL for non-data URLs
        console.log("[PDFPreviewDialog] URL preview:", pdfUrl.substring(0, 100) + "...");
      }
    }
  }, [open, pdfUrl]);

  const handleDownload = () => {
    if (onSave) {
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

  // If no PDF URL is provided, show a message
  if (!pdfUrl && open) {
    console.error("[PDFPreviewDialog] No PDF URL provided to the dialog");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
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
          
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
