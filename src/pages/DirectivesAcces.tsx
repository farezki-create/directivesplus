
import React from "react";
import { useDossierStore } from "@/store/dossierStore";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useDirectivesAccessState } from "@/hooks/useDirectivesAccessState";
import NoAccessView from "@/components/directives-access/NoAccessView";
import AuthenticatedView from "@/components/directives-access/AuthenticatedView";
import DossierView from "@/components/directives-access/DossierView";

const DirectivesAcces = () => {
  const { dossierActif } = useDossierStore();
  const { showDocuments, setShowDocuments } = useDirectivesAccessState();

  // Hook pour les documents (si l'utilisateur est connecté)
  const {
    user,
    isAuthenticated,
    documents,
    handleUploadComplete,
    handleDownload,
    handlePrint,
    handleView,
    handleDelete
  } = useDirectivesDocuments();

  console.log("DirectivesAcces - État:", {
    dossierActif: !!dossierActif,
    isAuthenticated,
    currentPath: window.location.pathname
  });

  const handleShowDocuments = () => {
    setShowDocuments(true);
  };

  // Wrapper function to handle upload completion
  const handleUploadCompleteWrapper = () => {
    // For this context, we don't have the specific parameters,
    // so we'll call refresh documents directly
    window.location.reload();
  };

  // CAS 1: Pas de dossier actif ET pas d'utilisateur authentifié
  if (!dossierActif && !isAuthenticated) {
    return <NoAccessView />;
  }

  // CAS 2: Utilisateur authentifié mais pas de dossier actif
  if (!dossierActif && isAuthenticated) {
    return (
      <AuthenticatedView
        user={user}
        documents={documents}
        onUploadComplete={handleUploadCompleteWrapper}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onView={handleView}
        onDelete={(documentId: string) => handleDelete()}
      />
    );
  }

  // CAS 3: Dossier actif (avec ou sans authentification)
  return (
    <DossierView
      isAuthenticated={isAuthenticated}
      user={user}
      showDocuments={showDocuments}
      documents={documents}
      onUploadComplete={handleUploadCompleteWrapper}
      onDownload={handleDownload}
      onPrint={handlePrint}
      onView={handleView}
      onDelete={(documentId: string) => handleDelete()}
      onShowDocuments={handleShowDocuments}
    />
  );
};

export default DirectivesAcces;
