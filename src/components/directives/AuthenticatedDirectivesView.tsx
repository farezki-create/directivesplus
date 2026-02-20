
import React from "react";
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesPageContent from "@/components/documents/DirectivesPageContent";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import DeleteConfirmationDialog from "@/components/documents/DeleteConfirmationDialog";
import { Document } from "@/types/documents";

interface AuthenticatedDirectivesViewProps {
  user: any;
  profile: any;
  documents: Document[];
  isLoading?: boolean;
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  onUploadComplete: () => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (document: Document) => Promise<void>;
  documentToDelete: Document | null;
  setDocumentToDelete: (doc: Document | null) => void;
  previewDocument: string | null;
  setPreviewDocument: (filePath: string | null) => void;
  onPreviewDownload: (filePath: string) => void;
  onPreviewPrint: (filePath: string, fileType?: string) => void;
  hideUploadForInstitution?: boolean;
}

const AuthenticatedDirectivesView: React.FC<AuthenticatedDirectivesViewProps> = ({
  user,
  profile,
  documents,
  isLoading = false,
  showAddOptions,
  setShowAddOptions,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  onDelete,
  documentToDelete,
  setDocumentToDelete,
  previewDocument,
  setPreviewDocument,
  onPreviewDownload,
  onPreviewPrint,
  hideUploadForInstitution = false,
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      {!hideUploadForInstitution && (
        <DirectivesPageHeader 
          onAddDocument={() => setShowAddOptions(true)}
          documentsCount={documents.length}
        />
      )}
      
      <DirectivesPageContent
        documents={documents}
        onDownload={onDownload}
        onPrint={onPrint}
        onView={onView}
        onDelete={(documentId: string) => {
          const doc = documents.find(d => d.id === documentId);
          if (doc) setDocumentToDelete(doc);
        }}
      />

      {/* Document Preview Dialog */}
      {previewDocument && (
        <DocumentPreviewDialog
          filePath={previewDocument}
          onOpenChange={(open) => {
            if (!open) setPreviewDocument(null);
          }}
          onDownload={onPreviewDownload}
          onPrint={onPreviewPrint}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {documentToDelete && (
        <DeleteConfirmationDialog
          isOpen={!!documentToDelete}
          onClose={() => setDocumentToDelete(null)}
          onConfirm={() => onDelete(documentToDelete)}
          documentName={documentToDelete.file_name}
        />
      )}
    </div>
  );
};

export default AuthenticatedDirectivesView;
