
import React from "react";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import AuthenticatedDirectivesView from "@/components/directives/AuthenticatedDirectivesView";
import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import { MesDirectivesSharedAccess } from "@/components/documents/MesDirectivesSharedAccess";
import type { Document } from "@/types/documents";

const MesDirectives = () => {
  const [searchParams] = useSearchParams();
  const sharedCode = searchParams.get('shared_code');
  const accessType = searchParams.get('access');
  const userId = searchParams.get('user');
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth();
  
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

  // Vérifier si c'est un accès institution valide
  const hasInstitutionAccess = sessionStorage.getItem('institutionAccess') === 'true';

  console.log("MesDirectives - Auth state:", { 
    userId: user?.id, 
    hasProfile: !!profile, 
    isAuthenticated, 
    isLoading: authLoading,
    accessType,
    sharedCode,
    qrUserId: userId,
    hasInstitutionAccess
  });
  console.log("MesDirectives - Documents:", documents.length);

  // Si un code de partage est présent dans l'URL, afficher la vue de partage
  if (sharedCode) {
    return <MesDirectivesSharedAccess />;
  }

  // Afficher un message spécial pour les accès via QR code ou institution même sans authentification
  if (accessType === 'card' || hasInstitutionAccess) {
    console.log("MesDirectives - Accès via QR code ou institution détecté");
    // Permettre l'accès même si non authentifié pour les QR codes d'urgence et accès institution
  }

  // Wrapper function to handle upload completion
  const handleUploadCompleteWrapper = () => {
    handleUploadComplete();
  };

  // Enhanced view handler that sets preview document
  const handleViewDocument = (filePath: string, fileType?: string) => {
    console.log("MesDirectives - handleViewDocument appelé avec:", filePath, fileType);
    
    // Find the document by file_path
    const document = documents.find(doc => doc.file_path === filePath);
    if (document) {
      console.log("MesDirectives - Document trouvé pour preview:", document);
      setPreviewDocument(document);
    } else {
      console.error("MesDirectives - Document non trouvé pour le chemin:", filePath);
      // Fallback: call the original view handler
      handleView(filePath, fileType);
    }
  };

  // Preview handlers
  const handlePreviewDownload = (filePath: string) => {
    const document = previewDocument || documents.find(doc => doc.file_path === filePath);
    const fileName = document?.file_name || 'document.pdf';
    console.log("MesDirectives - handlePreviewDownload:", filePath, fileName);
    handleDownload(filePath, fileName);
  };

  const handlePreviewPrint = (filePath: string, fileType?: string) => {
    console.log("MesDirectives - handlePreviewPrint:", filePath, fileType);
    handlePrint(filePath, fileType);
  };

  // Enhanced delete handler that accepts Document object
  const handleDeleteDocument = async (document: Document) => {
    console.log("MesDirectives - handleDeleteDocument appelé avec:", document);
    await handleDelete(document.id);
  };

  // Pour les accès QR code ou institution sans authentification, ne pas rediriger
  if ((accessType === 'card' || hasInstitutionAccess) && !isAuthenticated && !authLoading) {
    console.log("MesDirectives - Accès QR code ou institution sans authentification autorisé");
    // Continuer sans redirection pour permettre l'accès d'urgence ou institution
  }
  // Rediriger vers la page de connexion SEULEMENT si pas d'accès QR/institution et non authentifié
  else if (!authLoading && !isAuthenticated && accessType !== 'card' && !hasInstitutionAccess) {
    // Redirection vers auth seulement pour les accès normaux (non QR/institution)
    window.location.href = '/auth';
    return null;
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

export default MesDirectives;
