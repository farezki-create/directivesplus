
import React from "react";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import AuthenticatedDirectivesView from "@/components/directives/AuthenticatedDirectivesView";
import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import { MesDirectivesSharedAccess } from "@/components/documents/MesDirectivesSharedAccess";
import { useDossierDocuments } from "@/hooks/directives/useDossierDocuments";
import { useDossierStore } from "@/store/dossierStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Document } from "@/types/documents";

const MesDirectives = () => {
  const [searchParams] = useSearchParams();
  const sharedCode = searchParams.get('shared_code');
  const accessType = searchParams.get('access');
  const userId = searchParams.get('user');
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Vérifier si c'est un accès institution valide
  const hasInstitutionAccess = sessionStorage.getItem('institutionAccess') === 'true';
  const { dossierActif } = useDossierStore();
  
  // Toujours appeler les hooks pour éviter les erreurs conditionnelles
  const normalDocuments = useDirectivesDocuments();
  const dossierDocuments = useDossierDocuments();
  
  // Choisir la source de documents appropriée
  const documentsData = hasInstitutionAccess && dossierActif ? dossierDocuments : normalDocuments;
  
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
  } = documentsData;

  // Local state for preview document
  const [previewDocument, setPreviewDocument] = React.useState<Document | null>(null);

  // Déterminer si l'accès doit être autorisé
  const shouldAllowAccess = (accessType === 'card' || hasInstitutionAccess) || isAuthenticated;

  // Si c'est un accès institution et qu'il y a des documents, ouvrir directement le premier PDF
  React.useEffect(() => {
    if (hasInstitutionAccess && documents.length > 0 && !previewDocument && shouldAllowAccess) {
      const firstPdf = documents.find(doc => 
        doc.content_type === 'application/pdf' || 
        doc.file_name.toLowerCase().endsWith('.pdf')
      );
      
      if (firstPdf) {
        console.log("MesDirectives - Ouverture automatique du premier PDF:", firstPdf);
        // Ouvrir directement le PDF dans un nouvel onglet
        window.open(firstPdf.file_path, '_blank');
      }
    }
  }, [hasInstitutionAccess, documents, previewDocument, shouldAllowAccess]);

  console.log("MesDirectives - Auth state:", { 
    userId: user?.id, 
    hasProfile: !!profile, 
    isAuthenticated, 
    isLoading: authLoading,
    accessType,
    sharedCode,
    qrUserId: userId,
    hasInstitutionAccess,
    hasDossierActif: !!dossierActif,
    documentsCount: documents.length
  });
  console.log("MesDirectives - Documents:", documents);

  // Si un code de partage est présent dans l'URL, afficher la vue de partage
  if (sharedCode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8">
          <MesDirectivesSharedAccess />
        </main>
        <Footer />
      </div>
    );
  }

  // Afficher l'état de chargement
  if (authLoading || documentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8">
          <DirectivesLoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  // Vérifier l'accès avant le rendu principal
  if (!shouldAllowAccess) {
    // Redirection vers auth seulement pour les accès normaux (non QR/institution)
    window.location.href = '/auth';
    return null;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8">
        <AuthenticatedDirectivesView
          user={hasInstitutionAccess && dossierActif ? { id: dossierActif.userId } : user}
          profile={hasInstitutionAccess && dossierActif?.profileData ? dossierActif.profileData : profile}
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
      </main>
      <Footer />
    </div>
  );
};

export default MesDirectives;
