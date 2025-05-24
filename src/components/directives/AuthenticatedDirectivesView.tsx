
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import DirectivesNavigation from "@/components/documents/DirectivesNavigation";
import DirectivesPageContent from "@/components/documents/DirectivesPageContent";
import DeleteConfirmationDialog from "@/components/documents/DeleteConfirmationDialog";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";

interface AuthenticatedDirectivesViewProps {
  user: any;
  profile: any;
  documents: any[];
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  onUploadComplete: () => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  confirmDelete: (documentId: string) => void;
  documentToDelete: string | null;
  setDocumentToDelete: (id: string | null) => void;
  handleDelete: () => void;
  previewDocument: string | null;
  setPreviewDocument: (path: string | null) => void;
  handlePreviewDownload: (filePath: string) => void;
  handlePreviewPrint: (filePath: string) => void;
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
  confirmDelete,
  documentToDelete,
  setDocumentToDelete,
  handleDelete,
  previewDocument,
  setPreviewDocument,
  handlePreviewDownload,
  handlePreviewPrint
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <DirectivesNavigation />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Directives</h1>
          <p className="text-gray-600">
            Gérez vos directives anticipées et documents associés
          </p>
        </div>
        
        <DirectivesPageContent
          documents={documents}
          showAddOptions={showAddOptions}
          setShowAddOptions={setShowAddOptions}
          userId={user.id}
          onUploadComplete={onUploadComplete}
          onDownload={onDownload}
          onPrint={onPrint}
          onView={onView}
          onDelete={confirmDelete}
          profile={profile}
        />
      </main>
      
      <DeleteConfirmationDialog
        documentId={documentToDelete}
        onOpenChange={() => setDocumentToDelete(null)}
        onConfirmDelete={handleDelete}
      />

      <DocumentPreviewDialog
        filePath={previewDocument}
        onOpenChange={() => setPreviewDocument(null)}
        onDownload={handlePreviewDownload}
        onPrint={handlePreviewPrint}
        showPrint={false}
      />
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticatedDirectivesView;
