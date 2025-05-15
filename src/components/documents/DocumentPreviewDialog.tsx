
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Prévisualisation audio</DialogTitle>
          <DialogDescription>
            Écoutez votre enregistrement audio
          </DialogDescription>
        </DialogHeader>
        {isAudio && filePath && (
          <audio className="w-full" controls src={filePath} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
