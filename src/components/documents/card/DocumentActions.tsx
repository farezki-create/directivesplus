
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Eye, Trash2, FolderPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentActionsProps {
  onView: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onDelete: () => void;
  onAddToSharedFolder?: () => void;
  showPrint?: boolean;
  isAddingToShared?: boolean;
}

/**
 * Component that displays action buttons for a document
 */
const DocumentActions: React.FC<DocumentActionsProps> = ({
  onView,
  onDownload,
  onPrint,
  onDelete,
  onAddToSharedFolder,
  showPrint = true,
  isAddingToShared = false
}) => {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onView}
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Voir le document"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Voir</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onDownload}
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Télécharger le document"
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Télécharger</TooltipContent>
        </Tooltip>

        {showPrint && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPrint}
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label="Imprimer le document"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Imprimer</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onDelete}
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Supprimer le document"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Supprimer</TooltipContent>
        </Tooltip>

        {onAddToSharedFolder && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAddToSharedFolder}
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={isAddingToShared}
                aria-label="Ajouter au dossier partagé"
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ajouter au dossier partagé</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default DocumentActions;
