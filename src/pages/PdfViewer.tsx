
import React from "react";
import { useSearchParams } from "react-router-dom";
import { usePdfViewerState } from "@/hooks/usePdfViewerState";
import ExternalBrowserView from "@/components/pdf-viewer/ExternalBrowserView";
import LoadingState from "@/components/pdf-viewer/LoadingState";
import ErrorState from "@/components/pdf-viewer/ErrorState";
import PdfViewerContent from "@/components/pdf-viewer/PdfViewerContent";

const PdfViewer = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('id');
  const accessType = searchParams.get('access');
  const userId = searchParams.get('user');
  
  console.log("🔍 PdfViewer - Paramètres URL:", {
    documentId,
    accessType,
    userId,
    fullUrl: window.location.href
  });

  const {
    isExternalBrowser,
    document,
    loading,
    error,
    retryCount,
    handleRetry,
    handleDownloadPdf,
    handlePrintPdf,
    handleOpenExternal,
    handleGoBack,
    handleDownload
  } = usePdfViewerState();

  // Si pas d'ID de document, afficher une erreur immédiatement
  if (!documentId) {
    console.error("❌ PdfViewer - Document ID manquant dans l'URL");
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">Document introuvable</h1>
            <p className="text-gray-600 mb-4">
              L'identifiant du document est manquant dans l'URL.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.href = '/mes-directives'}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Retour à mes directives
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
              >
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État de chargement
  if (loading) {
    console.log("⏳ PdfViewer - État de chargement, tentative:", retryCount);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <LoadingState retryCount={retryCount} />
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error || !document) {
    console.error("❌ PdfViewer - Erreur ou document manquant:", { 
      error, 
      hasDocument: !!document,
      documentId
    });
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <ErrorState error={error} onRetry={handleRetry} documentId={documentId} />
          
          {/* Message spécial pour QR codes */}
          {accessType === 'card' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">📱 Accès via QR Code</h3>
              <p className="text-sm text-blue-700">
                Après correction des permissions RLS, le document devrait maintenant être accessible.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Si navigateur externe, afficher la vue spéciale
  if (isExternalBrowser) {
    console.log("📱 PdfViewer - Vue navigateur externe");
    return (
      <ExternalBrowserView
        documentId={documentId}
        document={document}
        error={error}
        retryCount={retryCount}
        onRetry={handleRetry}
        onDownload={handleDownload}
      />
    );
  }

  // Vue normale avec le document chargé
  console.log("✅ PdfViewer - Rendu normal avec document:", document.file_name);
  return (
    <div className="min-h-screen bg-gray-50">
      <PdfViewerContent
        document={document}
        onDownload={handleDownloadPdf}
        onPrint={handlePrintPdf}
        onOpenExternal={handleOpenExternal}
        onGoBack={handleGoBack}
      />
      
      {/* Confirmation de succès */}
      <div className="fixed bottom-4 right-4 max-w-sm p-3 bg-green-50 border border-green-200 rounded-lg shadow-lg">
        <h4 className="font-medium text-green-800 mb-1">✅ Document accessible</h4>
        <div className="text-xs text-green-700">
          <div>Nom: {document.file_name}</div>
          <div>Accès: {accessType === 'card' ? 'QR Code' : 'Direct'}</div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
