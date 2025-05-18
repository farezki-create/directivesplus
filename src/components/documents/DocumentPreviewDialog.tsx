
import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DocumentPreviewDialogProps {
  filePath: string | null;
  onOpenChange: (open: boolean) => void;
}

const DocumentPreviewDialog: FC<DocumentPreviewDialogProps> = ({
  filePath,
  onOpenChange,
}) => {
  const isOpen = !!filePath;
  const isAudio = filePath && filePath.includes('audio');
  const isPdf = filePath && filePath.includes('application/pdf');
  const isImage = filePath && (filePath.includes('image/jpeg') || filePath.includes('image/png') || filePath.includes('image/jpg'));
  
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
          <audio className="w-full" controls src={filePath} />
        )}
        
        {isPdf && filePath && (
          <iframe 
            src={filePath} 
            className="w-full h-[70vh]" 
            title="Prévisualisation PDF"
          />
        )}
        
        {isImage && filePath && (
          <div className="flex justify-center">
            <img 
              src={filePath} 
              alt="Prévisualisation" 
              className="max-h-[70vh] object-contain" 
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
