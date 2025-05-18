
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  Trash,
  Printer
} from "lucide-react";

interface DocumentActionsProps {
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onPrint?: () => void;
  hideShare?: boolean;
}

const DocumentActions = ({
  onView,
  onDownload,
  onDelete,
  onPrint,
  hideShare = false
}: DocumentActionsProps) => {
  console.log("DocumentActions - Handlers disponibles:", { 
    onView: !!onView,
    onDownload: !!onDownload,
    onDelete: !!onDelete,
    onPrint: !!onPrint
  });

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button
        onClick={(e) => {
          e.preventDefault();
          console.log("Bouton Voir et imprimer cliqué");
          onView();
        }}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        <Eye className="h-3 w-3 mr-1" />
        Voir et imprimer
      </Button>
      <Button
        onClick={(e) => {
          e.preventDefault();
          onDownload();
        }}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        <Download className="h-3 w-3 mr-1" />
        Télécharger
      </Button>
      <Button
        onClick={(e) => {
          e.preventDefault();
          onDelete();
        }}
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

