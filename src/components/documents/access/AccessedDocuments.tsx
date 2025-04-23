
import { Card } from "@/components/ui/card";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";
import { DocumentsList } from "../DocumentsList";
import { Document } from "../types";

interface AccessedDocumentsProps {
  documents: Document[];
  selectedDocumentId: string | null;
  previewUrl: string | null;
  isPreviewOpen: boolean;
  setIsPreviewOpen: (open: boolean) => void;
  onPreview: (doc: any) => void;
  accessData: {
    isFullAccess: boolean;
    allowedDocumentId?: string;
  } | null;
}

export function AccessedDocuments({
  documents,
  selectedDocumentId,
  previewUrl,
  isPreviewOpen,
  setIsPreviewOpen,
  onPreview,
  accessData
}: AccessedDocumentsProps) {
  if (!accessData || !documents.length) return null;

  return (
    <Card className="p-6">
      <DocumentsList
        documents={documents}
        onPreview={onPreview}
        selectedDocumentId={selectedDocumentId}
        previewUrl={previewUrl}
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
        restrictedAccess={accessData}
      />
    </Card>
  );
}
