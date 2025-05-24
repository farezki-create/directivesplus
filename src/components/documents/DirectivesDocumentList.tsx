
import { DocumentCardRefactored } from "@/components/documents/card/DocumentCardRefactored";
import EmptyDocumentsState from "@/components/documents/EmptyDocumentsState";
import { Document } from "@/types/documents";

interface DirectivesDocumentListProps {
  documents: Document[];
  loading?: boolean;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  onAddToSharedFolder?: (document: Document) => void;
  isAdding?: boolean;
  showPrint?: boolean;
  isAuthenticated?: boolean;
}

const DirectivesDocumentList = ({
  documents,
  loading = false,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  onAddToSharedFolder,
  isAdding = false,
  showPrint = true,
  isAuthenticated = false
}: DirectivesDocumentListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return <EmptyDocumentsState message="Vous n'avez pas encore ajouté de directives anticipées" />;
  }

  return (
    <div className="grid gap-6">
      {documents.map((doc) => (
        <DocumentCardRefactored 
          key={doc.id}
          document={doc}
          onDownload={onDownload}
          onPrint={onPrint}
          onView={onView}
          onDelete={onDelete}
          onVisibilityChange={onVisibilityChange}
          onAddToSharedFolder={onAddToSharedFolder ? () => onAddToSharedFolder(doc) : undefined}
          showPrint={showPrint}
          showShare={false}
          isAddingToShared={isAdding}
        />
      ))}
    </div>
  );
};

export default DirectivesDocumentList;
