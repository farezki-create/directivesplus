
import React from "react";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AuthenticatedDirectivesView from "@/components/directives/AuthenticatedDirectivesView";
import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";

const MesDirectives = () => {
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
    confirmDelete,
    handleDelete,
    handleUploadComplete,
    handlePreviewDownload,
    handlePreviewPrint
  } = useDirectivesDocuments();

  console.log("MesDirectives - Auth state:", { userId: user?.id, hasProfile: !!profile, isAuthenticated, isLoading: authLoading });
  console.log("MesDirectives - Documents:", documents.length);

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
};

export default MesDirectives;
