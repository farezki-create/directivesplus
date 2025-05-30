
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { usePublicDirectivesAccess } from "@/hooks/usePublicDirectivesAccess";
import { useDirectivesState } from "@/hooks/directives/useDirectivesState";
import PublicDirectivesView from "@/components/directives/PublicDirectivesView";
import type { Document } from "@/types/documents";

const DirectivesDocs = () => {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const { 
    publicAccessVerified, 
    publicAccessLoading, 
    dossierActif, 
    handlePublicAccess,
    urlParams,
    institutionAccess
  } = usePublicDirectivesAccess(isAuthenticated);
  
  const {
    previewDocument,
    setPreviewDocument,
    showAddOptionsPublic,
    setShowAddOptionsPublic
  } = useDirectivesState();
  
  const {
    isLoading: documentsLoading,
    documents,
    showAddOptions,
    setShowAddOptions,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    handleDelete,
    handleUploadComplete,
  } = useDirectivesDocuments();

  console.log("DirectivesDocs - Auth state:", { userId: user?.id, hasProfile: !!profile, isAuthenticated, isLoading: authLoading });
  console.log("DirectivesDocs - Dossier actif:", dossierActif);
  console.log("DirectivesDocs - URL params:", urlParams);
  console.log("DirectivesDocs - Institution access:", institutionAccess);

  const isLoading = authLoading || documentsLoading || publicAccessLoading;

  const handleUploadCompleteWrapper = () => {
    handleUploadComplete();
  };

  const handleViewDocument = (filePath: string, fileType?: string) => {
    console.log("DirectivesDocs - handleViewDocument appelé avec:", filePath, fileType);
    setPreviewDocument(filePath);
  };

  const handlePreviewDownload = (filePath: string) => {
    const document = documents.find(doc => doc.file_path === filePath);
    const fileName = document?.file_name || 'document.pdf';
    console.log("DirectivesDocs - handlePreviewDownload:", filePath, fileName);
    handleDownload(filePath, fileName);
  };

  const handlePreviewPrint = (filePath: string, fileType?: string) => {
    console.log("DirectivesDocs - handlePreviewPrint:", filePath, fileType);
    handlePrint(filePath, fileType);
  };

  const handleDeleteDocument = async (document: Document) => {
    console.log("DirectivesDocs - handleDeleteDocument appelé avec:", document);
    await handleDelete(document.id);
  };

  return (
    <PublicDirectivesView
      dossierActif={dossierActif}
      profile={profile}
      documents={documents}
      onDownload={handleDownload}
      onPrint={handlePrint}
      onView={handleViewDocument}
      previewDocument={previewDocument}
      setPreviewDocument={setPreviewDocument}
      handlePreviewDownload={handlePreviewDownload}
      handlePreviewPrint={handlePreviewPrint}
      showAddOptions={showAddOptions}
      setShowAddOptions={setShowAddOptions}
      onUploadComplete={handleUploadCompleteWrapper}
    />
  );
};

export default DirectivesDocs;
