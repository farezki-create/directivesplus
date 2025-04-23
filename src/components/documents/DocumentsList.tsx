
import { Document } from "@/components/documents/types";
import { DocumentCard } from "./DocumentCard";
import { useAuth } from "@/hooks/useAuth";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";

interface DocumentsListProps {
  documents: Document[];
  onPreview: (document: Document) => void;
  selectedDocumentId?: string | null;
  previewUrl: string | null;
  isPreviewOpen: boolean;
  setIsPreviewOpen: (open: boolean) => void;
  onDelete?: (documentId: string) => void;
}

export function DocumentsList({ 
  documents, 
  onPreview, 
  selectedDocumentId, 
  previewUrl,
  isPreviewOpen,
  setIsPreviewOpen,
  onDelete
}: DocumentsListProps) {
  const { user } = useAuth();

  if (!documents.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun document disponible pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Documents disponibles</h3>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onPreview={onPreview}
          selectedDocumentId={selectedDocumentId}
          isAuthenticated={!!user}
          onDelete={onDelete}
        />
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
