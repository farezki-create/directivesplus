
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

  return (
    <DialogFooter className="flex justify-between items-center">
      <div>
        {filePath && (
          <>
            {!isAudio && (
              <Button 
                onClick={onPrint} 
                variant="outline" 
                className="mr-2"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
            )}
            <Button 
              onClick={onDownload} 
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
  );
};

export default PreviewFooter;
