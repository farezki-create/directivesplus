
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
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  onPrint?: (filePath: string, fileType?: string) => void; // Added onPrint prop
  onShare?: (documentId: string) => void; // Added onShare prop
}

const DirectivesDocumentList: FC<DirectivesDocumentListProps> = ({
  documents,
  onDownload,
  onView,
  onDelete,
  onPrint,
  onShare
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
          onDownload={onDownload}
          onView={onView}
          onDelete={onDelete}
          onPrint={onPrint}
          onShare={onShare}
        />
      ))}
    </div>
  );
};

export default DirectivesDocumentList;
