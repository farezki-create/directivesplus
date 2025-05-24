
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FolderPlus, Check } from "lucide-react";
import { ShareDialogActions } from "./ShareDialogActions";
import type { ShareableDocument } from "@/hooks/sharing/useUnifiedDocumentSharing";

interface ShareDialogContentProps {
  document: ShareableDocument;
  accessCode: string | null;
  isSharing: string | null;
  isExtending: boolean;
  isRegenerating: boolean;
  onShareDocument: () => void;
  onCopyCode: () => void;
  onRegenerateCode: () => void;
  onExtendCode: () => void;
  onShowCard: () => void;
}

export const ShareDialogContent: React.FC<ShareDialogContentProps> = ({
  document,
  accessCode,
  isSharing,
  isExtending,
  isRegenerating,
  onShareDocument,
  onCopyCode,
  onRegenerateCode,
  onExtendCode,
  onShowCard
}) => {
  if (!accessCode) {
    return (
      <div className="space-y-4">
        <Alert>
          <FolderPlus className="h-4 w-4" />
          <AlertDescription>
            <strong>Document :</strong> {document.file_name}<br />
            Un code d'accès unique sera généré avec une validité d'1 an.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={onShareDocument}
          disabled={isSharing === document.id}
          className="flex items-center gap-2 w-full"
        >
          <FolderPlus className="h-4 w-4" />
          {isSharing === document.id ? "Partage en cours..." : "Partager le document"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Document partagé avec succès !</strong><br />
          Code d'accès généré : <strong className="font-mono text-lg">{accessCode}</strong><br />
          <span className="text-sm">Valable pendant 1 an</span>
        </AlertDescription>
      </Alert>

      <ShareDialogActions
        accessCode={accessCode}
        isExtending={isExtending}
        isRegenerating={isRegenerating}
        onCopyCode={onCopyCode}
        onRegenerateCode={onRegenerateCode}
        onExtendCode={onExtendCode}
        onShowCard={onShowCard}
      />

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <strong>Instructions :</strong><br />
        • Partagez ce code uniquement avec les personnes autorisées<br />
        • Le code permet d'accéder au document sans connexion<br />
        • Vous pouvez prolonger ou régénérer le code à tout moment<br />
        • La carte d'accès peut être imprimée au format carte bancaire
      </div>
    </div>
  );
};
