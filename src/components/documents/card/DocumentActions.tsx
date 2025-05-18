
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
  onPrint?: () => void;
}

const DocumentActions = ({
  onView,
  onDownload,
  onShare,
  onDelete,
  onPrint
}: DocumentActionsProps) => {
  console.log("DocumentActions - Handlers disponibles:", { 
    onView: !!onView, 
    onDownload: !!onDownload, 
    onShare: !!onShare, 
    onDelete: !!onDelete,
    onPrint: !!onPrint
  });

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Bouton Voir cliqué");
          onView();
        }}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        <Eye className="h-3 w-3 mr-1" />
        Voir
      </Button>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Bouton Télécharger cliqué");
          onDownload();
        }}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        <Download className="h-3 w-3 mr-1" />
        Télécharger
      </Button>
      {onPrint && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Bouton Imprimer cliqué");
            onPrint();
          }}
          size="sm"
          variant="outline"
          className="text-xs"
        >
          <Printer className="h-3 w-3 mr-1" />
          Imprimer
        </Button>
      )}
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Bouton Partager cliqué");
          onShare();
        }}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        <Share2 className="h-3 w-3 mr-1" />
        Partager
      </Button>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Bouton Supprimer cliqué");
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
