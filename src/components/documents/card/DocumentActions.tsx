
import { Button } from "@/components/ui/button";
import { Eye, Printer, Download, Trash2 } from "lucide-react";
import { Document } from "@/components/documents/types";

interface DocumentActionsProps {
  document: Document;
  isAuthenticated: boolean;
  onPreview: (document: Document) => void;
  onPrint: () => void;
  onDownload: () => void;
  onDelete?: () => void;
}

export function DocumentActions({ 
  document,
  isAuthenticated,
  onPreview,
  onPrint,
  onDownload,
  onDelete
}: DocumentActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onPreview(document)}
        title="Prévisualiser"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onPrint}
        title="Imprimer"
      >
        <Printer className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onDownload}
        title="Télécharger"
      >
        <Download className="h-4 w-4" />
      </Button>
      {isAuthenticated && onDelete && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
