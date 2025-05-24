
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, Printer, Trash2, Share2, FolderPlus } from "lucide-react";

interface DocumentActionsProps {
  onView: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onDelete: () => void;
  onAddToSharedFolder?: () => void;
  onShare?: () => void;
  showPrint?: boolean;
  isAddingToShared?: boolean;
  isSharing?: boolean;
}

const DocumentActions = ({
  onView,
  onDownload,
  onPrint,
  onDelete,
  onAddToSharedFolder,
  onShare,
  showPrint = true,
  isAddingToShared = false,
  isSharing = false
}: DocumentActionsProps) => {
  return (
    <div className="flex gap-2">
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

      {onShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          disabled={isSharing}
          className="flex items-center gap-1"
        >
          <Share2 size={16} />
          {isSharing ? "Partage..." : "Partager"}
        </Button>
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

export default DocumentActions;
