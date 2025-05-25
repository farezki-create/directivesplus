
import MedicalDocumentCard from "./MedicalDocumentCard";

interface MedicalDocumentsListProps {
  documents: any[];
  deletingDocuments: Set<string>;
  onPreview: (document: any) => void;
  onIncorporate: (document: any) => void;
  onDelete: (documentId: string) => void;
}

const MedicalDocumentsList = ({
  documents,
  deletingDocuments,
  onPreview,
  onIncorporate,
  onDelete
}: MedicalDocumentsListProps) => {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Documents médicaux ajoutés :</h4>
      <div className="space-y-3">
        {documents.map((doc) => (
          <MedicalDocumentCard
            key={doc.id}
            document={doc}
            isDeleting={deletingDocuments.has(doc.id)}
            onPreview={onPreview}
            onIncorporate={onIncorporate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MedicalDocumentsList;
