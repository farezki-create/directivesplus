
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PDFActionButtons } from "./PDFActionButtons";
import { PDFViewer } from "./PDFViewer";
import { useEffect } from "react";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  textContent?: string | null;
  onSave?: () => void;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  textContent,
  onSave,
}: PDFPreviewDialogProps) {
  const { toast } = useToast();

  // Reset state when dialog opens
  useEffect(() => {
    if (open && textContent) {
      console.log("[PDFPreviewDialog] Dialog opened with text content:", 
        textContent?.substring(0, 50) + "...");
    }
  }, [textContent, open]);

  const handleDownload = () => {
    // Download as text file
    if (!textContent) {
      toast({
        title: "Erreur",
        description: "Aucun contenu à télécharger",
        variant: "destructive",
      });
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "directives-anticipees.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Succès",
      description: "Document téléchargé",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Votre document texte a été généré. Vous pouvez le télécharger.
        </DialogDescription>
        
        <div className="flex flex-col space-y-4 h-full">
          <div className="flex flex-wrap justify-end gap-2">
            <PDFActionButtons 
              onDownload={handleDownload} 
              isTextMode={true}
            />
          </div>
          
          <PDFViewer textContent={textContent} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
