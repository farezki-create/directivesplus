
import { FC } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import DocumentPreviewHeader from "./preview/DocumentPreviewHeader";
import PreviewContent from "./preview/PreviewContent";
import PreviewFooter from "./preview/PreviewFooter";
import { detectDocumentType } from "./preview/documentUtils";

interface DocumentPreviewDialogProps {
  filePath: string | null;
  onOpenChange: (open: boolean) => void;
  onDownload?: (filePath: string) => void;
  onPrint?: (filePath: string) => void;
  showPrint?: boolean;
}

const DocumentPreviewDialog: FC<DocumentPreviewDialogProps> = ({
  filePath,
  onOpenChange,
  onDownload,
  onPrint,
  showPrint = true
}) => {
  console.log("DocumentPreviewDialog - rendu avec filePath:", filePath);
  const isOpen = !!filePath;
  
  const handleDownload = () => {
    console.log("DocumentPreviewDialog - handleDownload appelé");
    if (filePath && onDownload) {
      onDownload(filePath);
    }
  };
  
  const handlePrint = () => {
    console.log("DocumentPreviewDialog - handlePrint appelé");
    if (filePath && onPrint) {
      onPrint(filePath);
    }
  };
  
  const handleOpenExternal = () => {
    if (filePath) {
      console.log("DocumentPreviewDialog - Ouverture externe de:", filePath);
      window.open(filePath, '_blank');
    }
  };
  
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
          showPrint={showPrint}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
