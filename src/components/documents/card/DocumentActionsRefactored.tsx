
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, Printer, Trash2, FolderPlus } from "lucide-react";
import { DocumentShareButton } from "../sharing/DocumentShareButton";
import { ShareableDocument } from "@/types/sharing";

interface DocumentActionsRefactoredProps {
  document: ShareableDocument;
  onView: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onDelete: () => void;
  onAddToSharedFolder?: () => void;
  showPrint?: boolean;
  showShare?: boolean;
  isAddingToShared?: boolean;
}

export const DocumentActionsRefactored: React.FC<DocumentActionsRefactoredProps> = ({
  document,
  onView,
  onDownload,
  onPrint,
  onDelete,
  onAddToSharedFolder,
  showPrint = true,
  showShare = false,
  isAddingToShared = false
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        className="flex items-center gap-1"
      >
        <Eye size={16} />
        Voir
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        className="flex items-center gap-1"
      >
        <Download size={16} />
        Télécharger
      </Button>

      {showPrint && (
        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="flex items-center gap-1"
        >
          <Printer size={16} />
          Imprimer
        </Button>
      )}

      {showShare && (
        <DocumentShareButton
          document={document}
          variant="outline"
          size="sm"
        />
      )}

      {onAddToSharedFolder && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddToSharedFolder}
          disabled={isAddingToShared}
          className="flex items-center gap-1"
        >
          <FolderPlus size={16} />
          {isAddingToShared ? "Ajout..." : "Ajouter"}
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-1 text-red-600 hover:bg-red-50"
      >
        <Trash2 size={16} />
        Supprimer
      </Button>
    </div>
  );
};
