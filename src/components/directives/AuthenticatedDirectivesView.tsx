
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesAddDocumentSection from "@/components/documents/DirectivesAddDocumentSection";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";
import DeleteConfirmationDialog from "@/components/documents/DeleteConfirmationDialog";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import { Document } from "@/hooks/useDirectivesDocuments";

interface AuthenticatedDirectivesViewProps {
  user: any;
  profile: any;
  documents: Document[];
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  onUploadComplete: () => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  documentToDelete: string | null;
  setDocumentToDelete: (id: string | null) => void;
  handleDelete: () => Promise<void>;
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
  documentToDelete,
  setDocumentToDelete,
  handleDelete,
  previewDocument,
  setPreviewDocument,
  handlePreviewDownload,
  handlePreviewPrint,
}) => {
  
  const handleAddDocumentClick = () => {
    console.log("Bouton Ajouter un document cliqué");
    setShowAddOptions(!showAddOptions);
  };

  const handleDeleteAllDocuments = documents.length > 0 ? () => {
    console.log("Demande de suppression de tous les documents");
    // Cette fonction serait implémentée dans le composant parent
  } : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <DirectivesPageHeader 
            onAddDocument={handleAddDocumentClick}
            onDeleteAllDocuments={handleDeleteAllDocuments}
            documentsCount={documents.length}
          />

          {showAddOptions && user && (
            <DirectivesAddDocumentSection
              userId={user.id}
              onUploadComplete={(url: string, fileName: string, isPrivate: boolean) => {
                console.log("Document uploadé:", fileName);
                onUploadComplete();
              }}
            />
          )}
          
          <DirectivesDocumentList
            documents={documents}
            onDownload={onDownload}
            onPrint={onPrint}
            onView={onView}
            onDelete={setDocumentToDelete}
            isAuthenticated={true}
          />
        </div>
      </main>
      
      <DeleteConfirmationDialog 
        documentId={documentToDelete}
        onOpenChange={(open) => {
          if (!open) setDocumentToDelete(null);
        }}
        onConfirmDelete={handleDelete}
      />

      <DocumentPreviewDialog 
        filePath={previewDocument} 
        onOpenChange={(open) => {
          if (!open) setPreviewDocument(null);
        }}
        onDownload={handlePreviewDownload}
        onPrint={handlePreviewPrint}
      />
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticatedDirectivesView;
