
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
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  onUploadComplete: () => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  documentToDelete: Document | null;
  setDocumentToDelete: (doc: Document | null) => void;
  handleDelete: (document: Document) => Promise<void>;
  previewDocument: Document | null;
  setPreviewDocument: (doc: Document | null) => void;
  handlePreviewDownload: (filePath: string) => void;
  handlePreviewPrint: (filePath: string, fileType?: string) => void;
}

const AuthenticatedDirectivesView: React.FC<AuthenticatedDirectivesViewProps> = ({
  user,
  profile,
  documents,
  showAddOptions,
  setShowAddOptions,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  documentToDelete,
  setDocumentToDelete,
  handleDelete,
  previewDocument,
  setPreviewDocument,
  handlePreviewDownload,
  handlePreviewPrint,
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <DirectivesPageHeader 
        onAddDocument={() => setShowAddOptions(true)}
        documentsCount={documents.length}
      />
      
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
          filePath={previewDocument.file_path}
          onOpenChange={(open) => !open && setPreviewDocument(null)}
          onDownload={handlePreviewDownload}
          onPrint={handlePreviewPrint}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {documentToDelete && (
        <DeleteConfirmationDialog
          isOpen={!!documentToDelete}
          onClose={() => setDocumentToDelete(null)}
          onConfirm={() => handleDelete(documentToDelete)}
          documentName={documentToDelete.file_name}
        />
      )}
    </div>
  );
};

export default AuthenticatedDirectivesView;
