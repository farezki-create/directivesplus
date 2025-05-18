
import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X } from "lucide-react";

interface DocumentPreviewDialogProps {
  filePath: string | null;
  onOpenChange: (open: boolean) => void;
  onDownload?: (filePath: string) => void;
  onPrint?: (filePath: string) => void;
}

const DocumentPreviewDialog: FC<DocumentPreviewDialogProps> = ({
  filePath,
  onOpenChange,
  onDownload,
  onPrint,
}) => {
  const isOpen = !!filePath;
  
  // Déterminer le type de fichier
  const isAudio = filePath && (filePath.includes('audio') || filePath.includes('.mp3') || filePath.includes('.wav'));
  const isPdf = filePath && (filePath.includes('pdf') || filePath.endsWith('.pdf') || filePath.includes('application/pdf'));
  const isImage = filePath && (
    filePath.includes('image') || 
    filePath.endsWith('.jpg') || 
    filePath.endsWith('.jpeg') || 
    filePath.endsWith('.png') || 
    filePath.includes('image/jpeg') || 
    filePath.includes('image/png')
  );
  
  const handleDownload = () => {
    if (filePath && onDownload) {
      onDownload(filePath);
    }
  };
  
  const handlePrint = () => {
    if (filePath && onPrint) {
      onPrint(filePath);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prévisualisation du document</DialogTitle>
          <DialogDescription>
            {isAudio && "Écoutez votre enregistrement audio"}
            {isPdf && "Visualisez votre document PDF"}
            {isImage && "Visualisez votre image"}
          </DialogDescription>
        </DialogHeader>
        
        {isAudio && filePath && (
          <div className="py-4">
            <audio className="w-full" controls src={filePath} />
          </div>
        )}
        
        {isPdf && filePath && (
          <iframe 
            src={filePath} 
            className="w-full h-[70vh]" 
            title="Prévisualisation PDF"
          />
        )}
        
        {isImage && filePath && (
          <div className="flex justify-center py-4">
            <img 
              src={filePath} 
              alt="Prévisualisation" 
              className="max-h-[70vh] object-contain" 
            />
          </div>
        )}
        
        <DialogFooter className="flex justify-between items-center">
          <div>
            {filePath && (
              <>
                {!isAudio && (
                  <Button 
                    onClick={handlePrint} 
                    variant="outline" 
                    className="mr-2"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                )}
                <Button 
                  onClick={handleDownload} 
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </>
            )}
          </div>
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline"
          >
            <X className="h-4 w-4 mr-2" />
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
