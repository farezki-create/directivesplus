
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import DirectivesPageContainer from "@/components/documents/directives/DirectivesPageContainer";
import { useDossierStore } from "@/store/dossierStore";

interface AuthenticatedDirectivesViewProps {
  user: any;
  profile: any;
  documents: any[];
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  onUploadComplete: () => void;
  onDownload: (doc: any) => void;
  onPrint: (doc: any) => void;
  onView: (doc: any) => void;
  confirmDelete: any;
  documentToDelete: any;
  setDocumentToDelete: (doc: any) => void;
  handleDelete: () => void;
  previewDocument: any;
  setPreviewDocument: (doc: any) => void;
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
  const { dossierActif } = useDossierStore();
  
  // Si on est en accès par code (dossier actif sans authentification complète)
  const isCodeAccess = dossierActif && !user;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={isCodeAccess} />
      
      <DirectivesPageContainer
        user={user}
        profile={profile}
        documents={documents}
        showAddOptions={showAddOptions}
        setShowAddOptions={setShowAddOptions}
        onUploadComplete={onUploadComplete}
        onDownload={onDownload}
        onPrint={onPrint}
        onView={onView}
        confirmDelete={confirmDelete}
        documentToDelete={documentToDelete}
        setDocumentToDelete={setDocumentToDelete}
        handleDelete={handleDelete}
        previewDocument={previewDocument}
        setPreviewDocument={setPreviewDocument}
        handlePreviewDownload={handlePreviewDownload}
        handlePreviewPrint={handlePreviewPrint}
      />
    </div>
  );
};

export default AuthenticatedDirectivesView;
