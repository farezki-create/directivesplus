
import { FC } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import DocumentPreviewHeader from "./preview/DocumentPreviewHeader";
import PreviewContent from "./preview/PreviewContent";
import PreviewFooter from "./preview/PreviewFooter";
import { detectDocumentType, downloadFile, printDocument } from "./preview/documentUtils";

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
  
  console.log("[DocumentPreviewDialog] filePath:", filePath, "isOpen:", isOpen);
  
  const handleDownload = () => {
    if (filePath && onDownload) {
      onDownload(filePath);
    } else if (filePath) {
      // Fallback si onDownload n'est pas fourni
      downloadFile(filePath, toast);
    }
  };
  
  const handlePrint = () => {
    if (filePath && onPrint) {
      onPrint(filePath);
    } else if (filePath) {
      // Fallback si onPrint n'est pas fourni
      const { isAudio, isImage } = detectDocumentType(filePath);
      
      if (isAudio) {
        toast({
          title: "Information",
          description: "L'impression n'est pas disponible pour les fichiers audio"
        });
        return;
      }
      
      printDocument(filePath, isImage, toast);
    }
  };
  
  const handleOpenExternal = () => {
    if (filePath) {
      window.open(filePath, '_blank');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DocumentPreviewHeader filePath={filePath} />
        
        <PreviewContent 
          filePath={filePath} 
          onOpenExternal={handleOpenExternal} 
        />
        
        <PreviewFooter 
          filePath={filePath}
          onOpenChange={onOpenChange}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
