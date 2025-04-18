
import { Card } from "@/components/ui/card";
import { Document } from "@/components/documents/types";
import { DocumentMeta } from "./card/DocumentMeta";
import { DocumentActions } from "./card/DocumentActions";
import { DeleteConfirmDialog } from "./card/DeleteConfirmDialog";
import { useDocumentDeletion } from "@/hooks/useDocumentDeletion";

interface DocumentCardProps {
  document: Document;
  onPreview: (document: Document) => void;
  selectedDocumentId?: string | null;
  sharingCode: string | null;
  isAuthenticated: boolean;
  onDelete?: (documentId: string) => void;
}

export function DocumentCard({ 
  document,
  onPreview,
  isAuthenticated,
  onDelete
}: DocumentCardProps) {
  const {
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    handleDeleteDocument
  } = useDocumentDeletion(document, onDelete);

  return (
    <>
      <Card key={document.id} className="p-4">
        <div className="flex items-start justify-between">
          <DocumentMeta
            description={document.description || ""}
            createdAt={document.created_at}
            externalId={document.external_id}
            isCard={document.file_path?.includes('cards/')}
          />
          
          <DocumentActions
            document={document}
            isAuthenticated={isAuthenticated}
            onPreview={onPreview}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </div>
      </Card>
      
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteDocument}
        isDeleting={isDeleting}
      />
    </>
  );
}
