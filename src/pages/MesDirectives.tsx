
import React from "react";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams } from "react-router-dom";
import AuthenticatedDirectivesView from "@/components/directives/AuthenticatedDirectivesView";
import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import { MesDirectivesSharedAccess } from "@/components/documents/MesDirectivesSharedAccess";

const MesDirectives = () => {
  const [searchParams] = useSearchParams();
  const sharedCode = searchParams.get('shared_code');
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth();
  
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
    handleDelete,
    handleUploadComplete,
    handlePreviewDownload,
    handlePreviewPrint
  } = useDirectivesDocuments();

  console.log("MesDirectives - Auth state:", { userId: user?.id, hasProfile: !!profile, isAuthenticated, isLoading: authLoading });
  console.log("MesDirectives - Documents:", documents.length);

  // Si un code de partage est présent dans l'URL, afficher la vue de partage
  if (sharedCode) {
    return <MesDirectivesSharedAccess />;
  }

  // Wrapper function to handle upload completion
  const handleUploadCompleteWrapper = () => {
    handleUploadComplete();
  };

  // Rediriger vers la page de connexion si non authentifié
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Afficher l'état de chargement
  if (authLoading || documentsLoading) {
    return <DirectivesLoadingState />;
  }

  return (
    <AuthenticatedDirectivesView
      user={user}
      profile={profile}
      documents={documents}
      showAddOptions={showAddOptions}
      setShowAddOptions={setShowAddOptions}
      onUploadComplete={handleUploadCompleteWrapper}
      onDownload={handleDownload}
      onPrint={handlePrint}
      onView={handleView}
      documentToDelete={documentToDelete}
      setDocumentToDelete={setDocumentToDelete}
      handleDelete={handleDelete}
      previewDocument={previewDocument}
      setPreviewDocument={setPreviewDocument}
      handlePreviewDownload={handlePreviewDownload}
      handlePreviewPrint={handlePreviewPrint}
    />
  );
};

export default MesDirectives;
