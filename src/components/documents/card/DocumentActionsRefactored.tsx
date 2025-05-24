
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, Printer, Trash2 } from "lucide-react";
import { Document } from "@/types/documents";

interface DocumentActionsRefactoredProps {
  document: Document;
  onView: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onDelete: () => void;
  showPrint?: boolean;
}

export const DocumentActionsRefactored: React.FC<DocumentActionsRefactoredProps> = ({
  document,
  onView,
  onDownload,
  onPrint,
  onDelete,
  showPrint = true
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
