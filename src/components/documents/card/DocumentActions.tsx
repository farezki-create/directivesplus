
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, Printer, Trash2, Plus } from "lucide-react";

interface DocumentActionsProps {
  onView: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onDelete: () => void;
  onAddToSharedFolder?: () => void;
  showPrint?: boolean;
  isAddingToShared?: boolean;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  onView,
  onDownload,
  onPrint,
  onDelete,
  onAddToSharedFolder,
  showPrint = true,
  isAddingToShared = false
}) => {
  console.log("DocumentActions rendered with:", {
    hasAddToSharedFolder: !!onAddToSharedFolder,
    showPrint,
    isAddingToShared
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          console.log("DocumentActions - View button clicked");
          onView();
        }}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          console.log("DocumentActions - Download button clicked");
          onDownload();
        }}
        className="h-8 w-8 p-0"
      >
        <Download className="h-4 w-4" />
      </Button>
      
      {showPrint && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("DocumentActions - Print button clicked");
            onPrint();
          }}
          className="h-8 w-8 p-0"
        >
          <Printer className="h-4 w-4" />
        </Button>
      )}
      
      {onAddToSharedFolder && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("DocumentActions - Add to shared folder button clicked");
            onAddToSharedFolder();
          }}
          disabled={isAddingToShared}
          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
          title="Ajouter à Mes Directives"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          console.log("DocumentActions - Delete button clicked");
          onDelete();
        }}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DocumentActions;
