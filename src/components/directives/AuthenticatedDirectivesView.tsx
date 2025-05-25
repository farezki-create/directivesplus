
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import { DirectivesPageHeader } from "@/components/documents/DirectivesPageHeader";
import { DirectivesPageContent } from "@/components/documents/DirectivesPageContent";
import { DocumentPreviewDialog } from "@/components/documents/DocumentPreviewDialog";
import { DeleteConfirmationDialog } from "@/components/documents/DeleteConfirmationDialog";
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
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <DirectivesPageHeader 
            user={user}
            profile={profile}
          />
          
          <DirectivesPageContent
            documents={documents}
            showAddOptions={showAddOptions}
            setShowAddOptions={setShowAddOptions}
            onUploadComplete={onUploadComplete}
            onDownload={onDownload}
            onPrint={onPrint}
            onView={onView}
          />
        </div>
      </main>

      {/* Document Preview Dialog */}
      {previewDocument && (
        <DocumentPreviewDialog
          document={previewDocument}
          isOpen={!!previewDocument}
          onOpenChange={(open) => !open && setPreviewDocument(null)}
          onDownload={handlePreviewDownload}
          onPrint={handlePreviewPrint}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {documentToDelete && (
        <DeleteConfirmationDialog
          document={documentToDelete}
          isOpen={!!documentToDelete}
          onOpenChange={(open) => !open && setDocumentToDelete(null)}
          onConfirm={() => handleDelete(documentToDelete)}
        />
      )}
    </div>
  );
};

export default AuthenticatedDirectivesView;
