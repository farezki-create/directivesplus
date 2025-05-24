
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { ShareDialogContent } from "./ShareDialogContent";
import { ShareDialogCard } from "./ShareDialogCard";
import { useShareDialogLogic } from "./useShareDialogLogic";
import type { ShareableDocument } from "@/hooks/sharing/useUnifiedSharing";

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
  const {
    accessCode,
    userProfile,
    showCard,
    setShowCard,
    userName,
    isSharing,
    isExtending,
    isRegenerating,
    handleShareDocument,
    handleExtendCode,
    handleRegenerateCode,
    handleCopyCode,
    resetDialog
  } = useShareDialogLogic(document, open);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetDialog();
    }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager le document
          </DialogTitle>
          <DialogDescription>
            Partager ce document et gérer le code d'accès valable 1 an pour les personnes autorisées.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {showCard && accessCode ? (
            <ShareDialogCard
              userName={userName}
              userProfile={userProfile}
              accessCode={accessCode}
              document={document}
              onBack={() => setShowCard(false)}
            />
          ) : (
            <ShareDialogContent
              document={document}
              accessCode={accessCode}
              isSharing={isSharing ? document.id : null}
              isExtending={isExtending}
              isRegenerating={isRegenerating}
              onShareDocument={handleShareDocument}
              onCopyCode={handleCopyCode}
              onRegenerateCode={handleRegenerateCode}
              onExtendCode={handleExtendCode}
              onShowCard={() => setShowCard(true)}
            />
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {accessCode ? "Fermer" : "Annuler"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
