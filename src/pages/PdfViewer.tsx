
import React from "react";
import { usePdfViewerState } from "@/hooks/usePdfViewerState";
import ExternalBrowserView from "@/components/pdf-viewer/ExternalBrowserView";
import LoadingState from "@/components/pdf-viewer/LoadingState";
import ErrorState from "@/components/pdf-viewer/ErrorState";
import PdfViewerContent from "@/components/pdf-viewer/PdfViewerContent";

const PdfViewer = () => {
  const {
    documentId,
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

  console.log("PdfViewer - État détaillé:", {
    documentId,
    isExternalBrowser,
    hasDocument: !!document,
    documentPath: document?.file_path?.substring(0, 50) + "...",
    loading,
    error,
    retryCount,
    currentUrl: window.location.href,
    urlParams: new URLSearchParams(window.location.search).toString()
  });

  // Si pas d'ID de document, afficher une erreur claire
  if (!documentId) {
    console.error("PdfViewer - Document ID missing from URL");
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">Document introuvable</h1>
            <p className="text-gray-600 mb-4">
              L'identifiant du document est manquant dans l'URL.
            </p>
            <button 
              onClick={() => window.location.href = '/mes-directives'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retour à mes directives
            </button>
          </div>
        </div>
      </div>
    );
  }

  // État de chargement
  if (loading) {
    console.log("PdfViewer - Loading document:", documentId);
    return <LoadingState retryCount={retryCount} />;
  }

  // État d'erreur ou document non trouvé
  if (error || !document) {
    console.error("PdfViewer - Error or no document:", { error, hasDocument: !!document });
    
    // Page d'erreur spéciale pour les QR codes d'accès
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">Document inaccessible</h1>
            <p className="text-gray-600 mb-4">
              Le document demandé n'a pas pu être chargé.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ID du document : {documentId}
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Réessayer
              </button>
              
              <button 
                onClick={() => window.location.href = '/mes-directives'}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Accéder à mes directives
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-left">
                <h3 className="font-medium text-yellow-800 mb-2">Debug Info:</h3>
                <div className="text-xs text-yellow-700 space-y-1">
                  <div>Document ID: {documentId}</div>
                  <div>Error: {error || 'Document not found'}</div>
                  <div>Retry count: {retryCount}</div>
                  <div>URL: {window.location.href}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Si navigateur externe, afficher la vue spéciale
  if (isExternalBrowser) {
    console.log("PdfViewer - Rendering external browser view");
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

  // Vue normale dans l'application
  console.log("PdfViewer - Rendering normal view");
  return (
    <PdfViewerContent
      document={document}
      onDownload={handleDownloadPdf}
      onPrint={handlePrintPdf}
      onOpenExternal={handleOpenExternal}
      onGoBack={handleGoBack}
    />
  );
};

export default PdfViewer;
