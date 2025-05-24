
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { usePublicDirectivesAccess } from "@/hooks/usePublicDirectivesAccess";
import { useDirectivesState } from "@/hooks/directives/useDirectivesState";
import { useDirectivesDocumentHandlers } from "@/components/directives/DirectivesDocumentHandlers";
import { DirectivesAccessManager } from "@/components/directives/DirectivesAccessManager";

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

  const {
    handleUploadCompleteWrapper,
    handleViewDocument,
    handlePreviewDownload,
    handlePreviewPrint
  } = useDirectivesDocumentHandlers({
    documents,
    previewDocument,
    setPreviewDocument,
    handleDownload,
    handlePrint,
    handleView
  });

  console.log("DirectivesDocs - Auth state:", { userId: user?.id, hasProfile: !!profile, isAuthenticated, isLoading: authLoading });
  console.log("DirectivesDocs - Dossier actif:", dossierActif);
  console.log("DirectivesDocs - URL params:", urlParams);
  console.log("DirectivesDocs - Institution access:", institutionAccess);

  const isLoading = authLoading || documentsLoading || publicAccessLoading;

  return (
    <DirectivesAccessManager
      isLoading={isLoading}
      isAuthenticated={isAuthenticated}
      user={user}
      profile={profile}
      documents={documents}
      dossierActif={dossierActif}
      publicAccessVerified={publicAccessVerified}
      urlParams={urlParams}
      institutionAccess={institutionAccess}
      showAddOptions={showAddOptions}
      setShowAddOptions={setShowAddOptions}
      showAddOptionsPublic={showAddOptionsPublic}
      setShowAddOptionsPublic={setShowAddOptionsPublic}
      documentToDelete={documentToDelete}
      setDocumentToDelete={setDocumentToDelete}
      previewDocument={previewDocument}
      setPreviewDocument={setPreviewDocument}
      handleUploadCompleteWrapper={handleUploadCompleteWrapper}
      handleDownload={handleDownload}
      handlePrint={handlePrint}
      handleViewDocument={handleViewDocument}
      handleDelete={handleDelete}
      handlePreviewDownload={handlePreviewDownload}
      handlePreviewPrint={handlePreviewPrint}
    />
  );
};

export default DirectivesDocs;
