
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
  file_type?: string;
  user_id?: string;
  is_private?: boolean;
  content?: any;
}

interface DirectivesDocumentListProps {
  documents: Document[];
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  onAddToSharedFolder?: (document: Document) => void;
  isAdding?: boolean;
  showPrint?: boolean;
}

const DirectivesDocumentList: FC<DirectivesDocumentListProps> = ({
  documents,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  onAddToSharedFolder,
  isAdding = false,
  showPrint = false
}) => {
  if (documents.length === 0) {
    return <EmptyDocumentsState />;
  }

  console.log("DirectivesDocumentList - Rendering", documents.length, "documents");
  console.log("DirectivesDocumentList - onAddToSharedFolder function:", !!onAddToSharedFolder);
  console.log("DirectivesDocumentList - isAdding:", isAdding);
  
  return (
    <div className="grid gap-6">
      {documents.map((doc) => {
        console.log(`Rendering document card for: ${doc.file_name} with addToSharedFolder: ${!!onAddToSharedFolder}`);
        return (
          <DocumentCard 
            key={doc.id}
            document={doc}
            onDownload={onDownload}
            onPrint={onPrint}
            onView={onView}
            onDelete={onDelete}
            onVisibilityChange={onVisibilityChange}
            onAddToSharedFolder={onAddToSharedFolder ? () => {
              console.log("DocumentCard - Triggering onAddToSharedFolder for:", doc.file_name);
              onAddToSharedFolder(doc);
            } : undefined}
            showPrint={showPrint}
            isAddingToShared={isAdding}
          />
        );
      })}
    </div>
  );
};

export default DirectivesDocumentList;
