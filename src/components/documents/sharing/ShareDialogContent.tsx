
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FolderPlus, Check, AlertCircle } from "lucide-react";
import { ShareDialogActions } from "./ShareDialogActions";
import type { ShareableDocument } from "@/types/sharing";

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
        <Alert className="bg-blue-50 border-blue-200">
          <FolderPlus className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Partage global de tous vos documents</strong><br />
            Un code d'accès unique sera généré pour permettre l'accès à tous vos documents 
            (directives, PDF, documents médicaux) avec une validité d'1 an.
          </AlertDescription>
        </Alert>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Important :</strong> Ce code donnera accès à l'ensemble de vos documents. 
            Partagez-le uniquement avec des personnes de confiance.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={onShareDocument}
          disabled={isSharing === document.id}
          className="flex items-center gap-2 w-full"
        >
          <FolderPlus className="h-4 w-4" />
          {isSharing === document.id ? "Génération du code en cours..." : "Générer le code d'accès global"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Code d'accès global généré avec succès !</strong><br />
          Code d'accès : <strong className="font-mono text-lg tracking-wider">{accessCode}</strong><br />
          <span className="text-sm">Valable pendant 1 an - Donne accès à tous vos documents</span>
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

      <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded-lg border">
        <strong className="text-gray-800">Instructions d'utilisation :</strong><br />
        • Ce code donne accès à <strong>TOUS</strong> vos documents (directives, PDF, documents médicaux)<br />
        • Partagez ce code uniquement avec les personnes autorisées<br />
        • Le code permet d'accéder aux documents sans connexion<br />
        • Vous pouvez prolonger ou régénérer le code à tout moment<br />
        • La carte d'accès peut être imprimée au format carte bancaire
      </div>
    </div>
  );
};
