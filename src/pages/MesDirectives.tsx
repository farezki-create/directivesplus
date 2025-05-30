
import React from "react";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import AuthenticatedDirectivesView from "@/components/directives/AuthenticatedDirectivesView";
import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import { MesDirectivesSharedAccess } from "@/components/documents/MesDirectivesSharedAccess";
import { useDirectivesStore } from "@/store/directivesStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Document } from "@/types/documents";

const MesDirectives = () => {
  const [searchParams] = useSearchParams();
  const sharedCode = searchParams.get('shared_code');
  const accessType = searchParams.get('access');
  const userId = searchParams.get('user');
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const hasInstitutionAccess = sessionStorage.getItem('institutionAccess') === 'true';
  const { documents: storeDocuments } = useDirectivesStore();
  
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

  const [previewDocument, setPreviewDocument] = React.useState<string | null>(null);

  const shouldAllowAccess = (accessType === 'card' || hasInstitutionAccess) || isAuthenticated;

  console.log("MesDirectives - Auth state:", { 
    userId: user?.id, 
    hasProfile: !!profile, 
    isAuthenticated, 
    isLoading: authLoading,
    accessType,
    sharedCode,
    qrUserId: userId,
    hasInstitutionAccess,
    documentsCount: documents.length,
    storeDocumentsCount: storeDocuments.length
  });

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

  if (!shouldAllowAccess) {
    window.location.href = '/auth';
    return null;
  }

  const handleUploadCompleteWrapper = () => {
    handleUploadComplete();
  };

  const handleViewDocument = (filePath: string, fileType?: string) => {
    console.log("MesDirectives - handleViewDocument appelé avec:", filePath, fileType);
    setPreviewDocument(filePath);
  };

  const handlePreviewDownload = (filePath: string) => {
    const document = documents.find(doc => doc.file_path === filePath);
    const fileName = document?.file_name || 'document.pdf';
    console.log("MesDirectives - handlePreviewDownload:", filePath, fileName);
    handleDownload(filePath, fileName);
  };

  const handlePreviewPrint = (filePath: string, fileType?: string) => {
    console.log("MesDirectives - handlePreviewPrint:", filePath, fileType);
    handlePrint(filePath, fileType);
  };

  const handleDeleteDocument = async (document: Document) => {
    console.log("MesDirectives - handleDeleteDocument appelé avec:", document);
    await handleDelete(document.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8">
        <AuthenticatedDirectivesView
          user={user}
          profile={profile}
          documents={documents}
          isLoading={documentsLoading}
          onView={handleViewDocument}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onDelete={handleDeleteDocument}
          onUploadComplete={handleUploadCompleteWrapper}
          showAddOptions={showAddOptions}
          setShowAddOptions={setShowAddOptions}
          documentToDelete={documentToDelete}
          setDocumentToDelete={setDocumentToDelete}
          previewDocument={previewDocument}
          setPreviewDocument={setPreviewDocument}
          onPreviewDownload={handlePreviewDownload}
          onPreviewPrint={handlePreviewPrint}
          hideUploadForInstitution={hasInstitutionAccess}
        />
      </main>
      <Footer />
    </div>
  );
};

export default MesDirectives;
