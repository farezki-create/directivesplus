
import React from "react";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useStableAuth } from "@/contexts/StableAuthContext";
import { Navigate, useSearchParams } from "react-router-dom";
import AuthenticatedDirectivesView from "@/components/directives/AuthenticatedDirectivesView";
import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import { MesDirectivesSharedAccess } from "@/components/documents/MesDirectivesSharedAccess";
import type { Document } from "@/types/documents";

const MesDirectivesStable = () => {
  const [searchParams] = useSearchParams();
  const sharedCode = searchParams.get('shared_code');
  const { user, profile, isAuthenticated, isLoading: authLoading } = useStableAuth();
  
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

  // Local state for preview document
  const [previewDocument, setPreviewDocument] = React.useState<Document | null>(null);

  console.log("MesDirectivesStable - Auth state:", { 
    userId: user?.id, 
    hasProfile: !!profile, 
    isAuthenticated, 
    isLoading: authLoading 
  });
  console.log("MesDirectivesStable - Documents:", documents.length);

  // Si un code de partage est présent dans l'URL, afficher la vue de partage
  if (sharedCode) {
    return <MesDirectivesSharedAccess />;
  }

  // Wrapper function to handle upload completion
  const handleUploadCompleteWrapper = () => {
    handleUploadComplete();
  };

  // Enhanced view handler that sets preview document
  const handleViewDocument = (filePath: string, fileType?: string) => {
    console.log("MesDirectivesStable - handleViewDocument appelé avec:", filePath, fileType);
    
    // Find the document by file_path
    const document = documents.find(doc => doc.file_path === filePath);
    if (document) {
      console.log("MesDirectivesStable - Document trouvé pour preview:", document);
      setPreviewDocument(document);
    } else {
      console.error("MesDirectivesStable - Document non trouvé pour le chemin:", filePath);
      // Fallback: call the original view handler
      handleView(filePath, fileType);
    }
  };

  // Preview handlers
  const handlePreviewDownload = (filePath: string) => {
    const document = previewDocument || documents.find(doc => doc.file_path === filePath);
    const fileName = document?.file_name || 'document.pdf';
    console.log("MesDirectivesStable - handlePreviewDownload:", filePath, fileName);
    handleDownload(filePath, fileName);
  };

  const handlePreviewPrint = (filePath: string, fileType?: string) => {
    console.log("MesDirectivesStable - handlePreviewPrint:", filePath, fileType);
    handlePrint(filePath, fileType);
  };

  // Enhanced delete handler that accepts Document object
  const handleDeleteDocument = async (document: Document) => {
    console.log("MesDirectivesStable - handleDeleteDocument appelé avec:", document);
    await handleDelete(document.id);
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
      onView={handleViewDocument}
      documentToDelete={documentToDelete}
      setDocumentToDelete={setDocumentToDelete}
      handleDelete={handleDeleteDocument}
      previewDocument={previewDocument}
      setPreviewDocument={setPreviewDocument}
      handlePreviewDownload={handlePreviewDownload}
      handlePreviewPrint={handlePreviewPrint}
    />
  );
};

export default MesDirectivesStable;
