
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Eye,
  Trash,
  Printer
} from "lucide-react";

interface DocumentActionsProps {
  onView: () => void;
  onDownload: () => void;
  onShare: () => void;
  onDelete: () => void;
  onPrint?: () => void; // Added onPrint prop
}

const DocumentActions = ({
  onView,
  onDownload,
  onShare,
  onDelete,
  onPrint
}: DocumentActionsProps) => {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button
        onClick={onView}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        <Eye className="h-3 w-3 mr-1" />
        Voir
      </Button>
      <Button
        onClick={onDownload}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        <Download className="h-3 w-3 mr-1" />
        Télécharger
      </Button>
      {onPrint && (
        <Button
          onClick={onPrint}
          size="sm"
          variant="outline"
          className="text-xs"
        >
          <Printer className="h-3 w-3 mr-1" />
          Imprimer
        </Button>
      )}
      <Button
        onClick={onShare}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        <Share2 className="h-3 w-3 mr-1" />
        Partager
      </Button>
      <Button
        onClick={onDelete}
        size="sm"
        variant="outline"
        className="text-xs text-red-500 hover:text-red-700 hover:border-red-200"
      >
        <Trash className="h-3 w-3 mr-1" />
        Supprimer
      </Button>
    </div>
  );
};

export default DocumentActions;
