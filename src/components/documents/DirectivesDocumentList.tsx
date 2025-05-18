
import { FC } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import EmptyDocumentsState from "@/components/documents/EmptyDocumentsState";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  user_id: string;
}

interface DirectivesDocumentListProps {
  documents: Document[];
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onShare: (documentId: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
}

const DirectivesDocumentList: FC<DirectivesDocumentListProps> = ({
  documents,
  onDownload,
  onPrint,
  onShare,
  onView,
  onDelete,
}) => {
  if (documents.length === 0) {
    return <EmptyDocumentsState />;
  }

  return (
    <div className="grid gap-6">
      {documents.map((doc) => (
        <DocumentCard 
          key={doc.id}
          document={doc}
          onDownload={() => onDownload(doc.file_path, doc.file_name)}
          onPrint={() => onPrint(doc.file_path, doc.content_type)}
          onShare={() => onShare(doc.id)}
          onView={() => onView(doc.file_path, doc.content_type)}
          onDelete={() => onDelete(doc.id)}
        />
      ))}
    </div>
  );
};

export default DirectivesDocumentList;
