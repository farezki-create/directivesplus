
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  Trash,
  Share2,  // Added Share2 icon
  Printer, // Added Printer icon
} from "lucide-react";

interface DocumentActionsProps {
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onPrint?: () => void;  // Added optional onPrint
  onShare?: () => void;  // Added optional onShare
}

const DocumentActions = ({
  onView,
  onDownload,
  onDelete,
  onPrint,
  onShare,
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
        Voir et imprimer
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
