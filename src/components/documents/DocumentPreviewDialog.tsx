
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
import { Download, Printer, X, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  
  // Déterminer le type de fichier avec plus de précision
  const isAudio = filePath && (
    filePath.includes('audio') || 
    filePath.endsWith('.mp3') || 
    filePath.endsWith('.wav') || 
    filePath.endsWith('.ogg')
  );
  
  const isPdf = filePath && (
    filePath.includes('pdf') || 
    filePath.endsWith('.pdf') || 
    filePath.includes('application/pdf')
  );
  
  const isImage = filePath && (
    filePath.includes('image') || 
    filePath.endsWith('.jpg') || 
    filePath.endsWith('.jpeg') || 
    filePath.endsWith('.png') || 
    filePath.endsWith('.gif') || 
    filePath.includes('image/jpeg') || 
    filePath.includes('image/png')
  );
  
  const handleDownload = () => {
    if (filePath && onDownload) {
      onDownload(filePath);
    } else if (filePath) {
      // Fallback si onDownload n'est pas fourni
      try {
        const fileName = filePath.split('/').pop() || 'document';
        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Téléchargement réussi",
          description: "Votre document a été téléchargé avec succès"
        });
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le document",
          variant: "destructive"
        });
      }
    }
  };
  
  const handlePrint = () => {
    if (filePath && onPrint) {
      onPrint(filePath);
    } else if (filePath) {
      // Fallback si onPrint n'est pas fourni
      try {
        if (isAudio) {
          toast({
            title: "Information",
            description: "L'impression n'est pas disponible pour les fichiers audio"
          });
          return;
        }
        
        if (isImage) {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Impression</title>
                  <style>
                    body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                    img { max-width: 100%; max-height: 90vh; object-fit: contain; }
                  </style>
                </head>
                <body>
                  <img src="${filePath}" alt="Document à imprimer" />
                  <script>
                    window.onload = function() {
                      setTimeout(function() { window.print(); }, 500);
                    }
                  </script>
                </body>
              </html>
            `);
            printWindow.document.close();
          }
          return;
        }
        
        // Pour PDF et autres types
        const printWindow = window.open(filePath, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 1000);
          };
        } else {
          throw new Error("Impossible d'ouvrir une fenêtre d'impression");
        }
      } catch (error) {
        console.error("Erreur lors de l'impression:", error);
        toast({
          title: "Erreur", 
          description: "Impossible d'imprimer le document",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleOpenExternal = () => {
    if (filePath) {
      window.open(filePath, '_blank');
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
            {!isAudio && !isPdf && !isImage && filePath && "Prévisualisation du document"}
          </DialogDescription>
        </DialogHeader>
        
        {isAudio && filePath && (
          <div className="py-4">
            <audio className="w-full" controls src={filePath}>
              Votre navigateur ne prend pas en charge la lecture audio
            </audio>
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
        
        {!isAudio && !isPdf && !isImage && filePath && (
          <div className="py-4 text-center">
            <p className="mb-4">Ce type de document ne peut pas être prévisualisé directement.</p>
            <Button onClick={handleOpenExternal} variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir dans un nouvel onglet
            </Button>
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
