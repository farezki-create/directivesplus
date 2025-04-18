
import { Document } from "@/components/documents/types";
import { DocumentCard } from "./DocumentCard";

interface DocumentsListProps {
  documents: Document[];
  onPreview: (document: Document) => void;
  selectedDocumentId?: string | null;
  sharingCode: string | null;
}

export function DocumentsList({ documents, onPreview, selectedDocumentId, sharingCode }: DocumentsListProps) {
  if (!documents.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun document partagé pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Documents partagés</h3>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onPreview={onPreview}
          selectedDocumentId={selectedDocumentId}
          sharingCode={sharingCode}
        />
      ))}
    </div>
  );
}
