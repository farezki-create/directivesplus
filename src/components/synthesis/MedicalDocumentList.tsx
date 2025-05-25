
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

  const renderDocumentContent = (doc: MedicalDocument) => {
    if (!doc.file_path) {
      return <p className="text-xs text-gray-500 mt-2">Contenu non disponible</p>;
    }

    // Si c'est un PDF (data URL)
    if (doc.file_path.startsWith('data:application/pdf')) {
      return (
        <div className="mt-3 border rounded overflow-hidden">
          <iframe 
            src={doc.file_path}
            className="w-full h-32"
            title={doc.name}
          />
          <p className="text-xs text-gray-500 p-2 bg-gray-50">
            Aperçu PDF - Cliquez sur "Voir" pour la vue complète
          </p>
        </div>
      );
    }

    // Si c'est une image (data URL)
    if (doc.file_path.startsWith('data:image/')) {
      return (
        <div className="mt-3 border rounded overflow-hidden">
          <img 
            src={doc.file_path}
            alt={doc.name}
            className="w-full max-h-32 object-contain bg-gray-50"
          />
          <p className="text-xs text-gray-500 p-2 bg-gray-50">
            Image médicale
          </p>
        </div>
      );
    }

    // Pour les autres types de contenu
    return (
      <div className="mt-3 p-3 bg-gray-50 rounded border">
        <p className="text-xs text-gray-600">
          Document disponible - Cliquez sur "Voir" pour l'afficher
        </p>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Documents médicaux ajoutés :</h4>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4 bg-blue-50 rounded-lg border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">{doc.name}</p>
                <p className="text-xs text-blue-600">
                  Ajouté le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  ✅ Sera inclus automatiquement dans le PDF
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
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
            
            {/* Affichage du contenu du document */}
            {renderDocumentContent(doc)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalDocumentList;
