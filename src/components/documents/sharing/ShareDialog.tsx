
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Check, FolderPlus, Copy } from "lucide-react";
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
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const { shareDocument, isSharing } = useUnifiedDocumentSharing();

  const handleShareDocument = async () => {
    const code = await shareDocument(document);
    if (code) {
      setAccessCode(code);
    }
  };

  const handleCopyCode = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      toast({
        title: "Code copié",
        description: "Le code d'accès a été copié dans le presse-papiers"
      });
    }
  };

  const resetDialog = () => {
    setAccessCode(null);
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
            Partager ce document et générer un code d'accès pour les personnes autorisées.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {!accessCode ? (
            <div className="space-y-4">
              <Alert>
                <FolderPlus className="h-4 w-4" />
                <AlertDescription>
                  <strong>Document :</strong> {document.file_name}<br />
                  Un code d'accès unique sera généré pour partager ce document.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleShareDocument}
                disabled={isSharing === document.id}
                className="flex items-center gap-2 w-full"
              >
                <FolderPlus className="h-4 w-4" />
                {isSharing === document.id ? "Partage en cours..." : "Partager le document"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Document partagé avec succès !</strong><br />
                  Code d'accès généré : <strong className="font-mono text-lg">{accessCode}</strong>
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleCopyCode}
                variant="outline"
                className="flex items-center gap-2 w-full"
              >
                <Copy className="h-4 w-4" />
                Copier le code d'accès
              </Button>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <strong>Instructions :</strong><br />
                • Partagez ce code uniquement avec les personnes autorisées<br />
                • Le code permet d'accéder au document sans connexion<br />
                • Gardez ce code en sécurité
              </div>
            </div>
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
