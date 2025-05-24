
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Check, FolderPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUnifiedDocumentSharing, ShareableDocument } from "@/hooks/sharing/useUnifiedDocumentSharing";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ShareableDocument;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  document
}) => {
  const [shared, setShared] = useState(false);
  const { shareDocument, isSharing } = useUnifiedDocumentSharing();

  const handleShareDocument = async () => {
    const success = await shareDocument(document);
    if (success) {
      setShared(true);
    }
  };

  const resetDialog = () => {
    setShared(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetDialog();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager le document
          </DialogTitle>
          <DialogDescription>
            Ajouter ce document au dossier partagé pour qu'il soit accessible aux personnes autorisées.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {!shared ? (
            <div className="space-y-4">
              <Alert>
                <FolderPlus className="h-4 w-4" />
                <AlertDescription>
                  <strong>Document :</strong> {document.file_name}<br />
                  Le document sera ajouté au dossier partagé et sera accessible aux personnes autorisées.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleShareDocument}
                disabled={isSharing === document.id}
                className="flex items-center gap-2 w-full"
              >
                <FolderPlus className="h-4 w-4" />
                {isSharing === document.id ? "Partage en cours..." : "Ajouter au dossier partagé"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Document partagé avec succès !</strong><br />
                  Le document a été ajouté au dossier partagé.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {shared ? "Fermer" : "Annuler"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
