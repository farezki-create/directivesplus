
import { Button } from "@/components/ui/button";
import { Trash, Eye, FileText } from "lucide-react";

interface MedicalDocumentCardProps {
  document: {
    id: string;
    name: string;
    created_at: string;
    file_path?: string;
  };
  isDeleting: boolean;
  onPreview: (document: any) => void;
  onIncorporate: (document: any) => void;
  onDelete: (documentId: string) => void;
}

const MedicalDocumentCard = ({
  document,
  isDeleting,
  onPreview,
  onIncorporate,
  onDelete
}: MedicalDocumentCardProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-900">{document.name}</p>
        <p className="text-xs text-blue-600">
          Ajouté le {new Date(document.created_at).toLocaleDateString('fr-FR')}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          ✅ Sera inclus automatiquement dans le PDF
        </p>
      </div>
      <div className="flex items-center gap-2">
        {document.file_path && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(document)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            >
              <Eye size={14} />
              Voir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onIncorporate(document)}
              className="text-green-600 hover:text-green-700 hover:bg-green-100"
            >
              <FileText size={14} />
              Incorporer
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(document.id)}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash size={14} />
          {isDeleting ? "..." : "Supprimer"}
        </Button>
      </div>
    </div>
  );
};

export default MedicalDocumentCard;
