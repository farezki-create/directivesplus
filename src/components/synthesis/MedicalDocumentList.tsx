
import { Button } from "@/components/ui/button";
import { Trash, Eye } from "lucide-react";

interface MedicalDocument {
  id: string;
  name: string;
  description: string;
  created_at: string;
  file_path?: string;
  file_type?: string;
}

interface MedicalDocumentListProps {
  documents: MedicalDocument[];
  deletingDocuments: Set<string>;
  onDeleteDocument: (documentId: string) => void;
  onPreviewDocument: (document: MedicalDocument) => void;
}

const MedicalDocumentList = ({
  documents,
  deletingDocuments,
  onDeleteDocument,
  onPreviewDocument
}: MedicalDocumentListProps) => {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Documents médicaux ajoutés :</h4>
      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">{doc.name}</p>
              <p className="text-xs text-blue-600">
                Ajouté le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                ✅ Sera inclus automatiquement dans le PDF
              </p>
            </div>
            <div className="flex items-center gap-2">
              {doc.file_path && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreviewDocument(doc)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                >
                  <Eye size={14} />
                  Voir
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteDocument(doc.id)}
                disabled={deletingDocuments.has(doc.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash size={14} />
                {deletingDocuments.has(doc.id) ? "..." : "Supprimer"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalDocumentList;
