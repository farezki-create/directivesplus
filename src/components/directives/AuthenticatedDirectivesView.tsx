
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

  const handleUploadCompleteWrapper = (url: string, fileName: string, isPrivate: boolean) => {
    onUploadComplete();
  };

  const handleDownloadWrapper = (filePath: string, fileName: string) => {
    onDownload({ file_path: filePath, file_name: fileName });
  };

  const handlePrintWrapper = (filePath: string, contentType?: string) => {
    onPrint({ file_path: filePath, content_type: contentType });
  };

  const handleViewWrapper = (filePath: string, contentType?: string) => {
    onView({ file_path: filePath, content_type: contentType });
  };

  const handleDeleteWrapper = (documentId: string) => {
    onView({ id: documentId });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={isCodeAccess} />
      
      <DirectivesPageContainer
        userId={user?.id || ""}
        profile={profile}
        documents={documents}
        showAddOptions={showAddOptions}
        setShowAddOptions={setShowAddOptions}
        onUploadComplete={handleUploadCompleteWrapper}
        onDownload={handleDownloadWrapper}
        onPrint={handlePrintWrapper}
        onView={handleViewWrapper}
        onDelete={handleDeleteWrapper}
        accessCode={null}
      />
    </div>
  );
};

export default AuthenticatedDirectivesView;
