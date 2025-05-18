
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X } from "lucide-react";
import { detectDocumentType } from "./documentUtils";

interface PreviewFooterProps {
  filePath: string | null;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
  onPrint: () => void;
}

const PreviewFooter = ({ 
  filePath, 
  onOpenChange, 
  onDownload, 
  onPrint 
}: PreviewFooterProps) => {
  const { isAudio } = filePath ? detectDocumentType(filePath) : { isAudio: false };
  
  console.log("[PreviewFooter] filePath:", filePath, "isAudio:", isAudio);

  return (
    <DialogFooter className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {filePath && (
          <>
            {!isAudio && (
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("[PreviewFooter] Bouton Imprimer cliqué");
                  onPrint();
                }}
                variant="outline" 
                className="flex items-center gap-1"
              >
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
            )}
            <Button 
              onClick={(e) => {
                e.preventDefault();
                console.log("[PreviewFooter] Bouton Télécharger cliqué");
                onDownload();
              }}
              variant="outline"
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </>
        )}
      </div>
      <Button 
        onClick={() => onOpenChange(false)} 
        variant="outline"
        className="flex items-center gap-1"
      >
        <X className="h-4 w-4" />
        Fermer
      </Button>
    </DialogFooter>
  );
};

export default PreviewFooter;
