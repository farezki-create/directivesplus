
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X } from "lucide-react";
import { detectDocumentType } from "./documentUtils";

interface PreviewFooterProps {
  filePath: string | null;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
  onPrint: () => void;
  showPrint?: boolean;
}

const PreviewFooter = ({ 
  filePath, 
  onOpenChange, 
  onDownload, 
  onPrint,
  showPrint = true
}: PreviewFooterProps) => {
  console.log("PreviewFooter - rendu avec filePath:", filePath);
  const fileInfo = filePath ? detectDocumentType(filePath) : { isAudio: false };
  const isAudio = fileInfo.isAudio;

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("PreviewFooter - Bouton Imprimer cliqué");
    onPrint();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("PreviewFooter - Bouton Télécharger cliqué");
    onDownload();
  };

  return (
    <DialogFooter className="flex justify-between items-center">
      <div>
        {filePath && (
          <>
            {!isAudio && showPrint && (
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
        onClick={() => {
          console.log("PreviewFooter - Bouton Fermer cliqué");
          onOpenChange(false);
        }} 
        variant="outline"
      >
        <X className="h-4 w-4 mr-2" />
        Fermer
      </Button>
    </DialogFooter>
  );
};

export default PreviewFooter;
