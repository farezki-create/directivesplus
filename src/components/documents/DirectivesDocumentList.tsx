
import { FC } from "react";
import { DocumentCardRefactored } from "@/components/documents/card/DocumentCardRefactored";
import EmptyDocumentsState from "@/components/documents/EmptyDocumentsState";
import { ShareableDocument } from "@/hooks/sharing/useUnifiedDocumentSharing";

interface DirectivesDocumentListProps {
  documents: ShareableDocument[];
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  onAddToSharedFolder?: (document: ShareableDocument) => void;
  isAdding?: boolean;
  showPrint?: boolean;
  isAuthenticated?: boolean;
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
  showPrint = false,
  isAuthenticated = false
}) => {
  if (documents.length === 0) {
    return <EmptyDocumentsState />;
  }

  console.log("DirectivesDocumentList - Rendering", documents.length, "documents");
  console.log("DirectivesDocumentList - isAuthenticated:", isAuthenticated);
  
  return (
    <div className="grid gap-6">
      {documents.map((doc) => {
        console.log(`Rendering document card for: ${doc.file_name}`);
        return (
          <DocumentCardRefactored 
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
            showShare={isAuthenticated}
            isAddingToShared={isAdding}
          />
        );
      })}
    </div>
  );
};

export default DirectivesDocumentList;
