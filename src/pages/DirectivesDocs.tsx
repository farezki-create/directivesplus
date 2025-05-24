
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { usePublicDirectivesAccess } from "@/hooks/usePublicDirectivesAccess";

import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import AuthenticatedDirectivesView from "@/components/directives/AuthenticatedDirectivesView";
import PublicDirectivesView from "@/components/directives/PublicDirectivesView";
import DirectivesAccessFormView from "@/components/directives/DirectivesAccessFormView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  
  console.log("DirectivesDocs - Auth state:", { userId: user?.id, hasProfile: !!profile, isAuthenticated, isLoading: authLoading });
  console.log("DirectivesDocs - Dossier actif:", dossierActif);
  console.log("DirectivesDocs - URL params:", urlParams);
  console.log("DirectivesDocs - Institution access:", institutionAccess);
  
  const {
    isLoading: documentsLoading,
    documents,
    showAddOptions,
    setShowAddOptions,
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    confirmDelete,
    handleDelete,
    handleUploadComplete,
    handlePreviewDownload,
    handlePreviewPrint
  } = useDirectivesDocuments();

  const isLoading = authLoading || documentsLoading || publicAccessLoading;

  // Si l'utilisateur est en train de se connecter, afficher un état de chargement
  if (isLoading) {
    return <DirectivesLoadingState />;
  }

  // Afficher l'erreur d'accès par institution si présente
  if (urlParams.hasAllParams && institutionAccess.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {institutionAccess.error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est authentifié, afficher directement ses documents
  if (isAuthenticated && user) {
    return (
      <AuthenticatedDirectivesView
        user={user}
        profile={profile}
        documents={documents}
        showAddOptions={showAddOptions}
        setShowAddOptions={setShowAddOptions}
        onUploadComplete={handleUploadComplete}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onView={handleView}
        confirmDelete={confirmDelete}
        documentToDelete={documentToDelete}
        setDocumentToDelete={setDocumentToDelete}
        handleDelete={handleDelete}
        previewDocument={previewDocument}
        setPreviewDocument={setPreviewDocument}
        handlePreviewDownload={handlePreviewDownload}
        handlePreviewPrint={handlePreviewPrint}
      />
    );
  }

  // Pour les utilisateurs non authentifiés avec accès public vérifié OU avec un dossier dans le store
  if (!isAuthenticated && (publicAccessVerified || dossierActif)) {
    return (
      <PublicDirectivesView
        dossierActif={dossierActif}
        profile={profile}
        documents={documents}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onView={handleView}
        previewDocument={previewDocument}
        setPreviewDocument={setPreviewDocument}
        handlePreviewDownload={handlePreviewDownload}
        handlePreviewPrint={handlePreviewPrint}
      />
    );
  }

  // Afficher le formulaire d'accès public si l'utilisateur n'est pas authentifié et n'a pas d'accès vérifié
  return (
    <DirectivesAccessFormView
      onSubmit={handlePublicAccess}
      loading={publicAccessLoading}
    />
  );
};

export default DirectivesDocs;
