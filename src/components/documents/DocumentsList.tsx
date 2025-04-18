
import { Document } from "@/components/documents/types";
import { DocumentCard } from "./DocumentCard";
import { useAuth } from "@/hooks/useAuth";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";

interface DocumentsListProps {
  documents: Document[];
  onPreview: (document: Document) => void;
  selectedDocumentId?: string | null;
  sharingCode: string | null;
  previewUrl: string | null;
  isPreviewOpen: boolean;
  setIsPreviewOpen: (open: boolean) => void;
  onDelete?: (documentId: string) => void;
  restrictedAccess?: {
    isFullAccess: boolean;
    allowedDocumentId?: string;
  };
}

export function DocumentsList({ 
  documents, 
  onPreview, 
  selectedDocumentId, 
  sharingCode, 
  previewUrl,
  isPreviewOpen,
  setIsPreviewOpen,
  onDelete,
  restrictedAccess
}: DocumentsListProps) {
  const { user } = useAuth();

  if (!documents.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun document disponible pour le moment
      </div>
    );
  }

  const isDocumentAccessible = (documentId: string) => {
    if (!restrictedAccess) return true;
    return restrictedAccess.isFullAccess || restrictedAccess.allowedDocumentId === documentId;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Documents disponibles</h3>
      {documents.map((doc) => (
        <div key={doc.id} className={!isDocumentAccessible(doc.id) ? "opacity-50 pointer-events-none" : ""}>
          <DocumentCard
            document={doc}
            onPreview={onPreview}
            selectedDocumentId={selectedDocumentId}
            sharingCode={sharingCode}
            isAuthenticated={!!user}
            onDelete={onDelete}
          />
        </div>
      ))}
      
      {previewUrl && (
        <PDFPreviewDialog
          key={previewUrl}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          pdfUrl={previewUrl}
        />
      )}
    </div>
  );
}
