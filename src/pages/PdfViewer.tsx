
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

  console.log("🔍 PdfViewer - État détaillé:", {
    documentId,
    isExternalBrowser,
    hasDocument: !!document,
    documentName: document?.file_name,
    documentPath: document?.file_path?.substring(0, 50) + "...",
    loading,
    error,
    retryCount,
    currentUrl: window.location.href,
    urlParams: new URLSearchParams(window.location.search).toString()
  });

  // Si pas d'ID de document, afficher une erreur claire
  if (!documentId) {
    console.error("❌ PdfViewer - Document ID missing from URL");
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">Document introuvable</h1>
            <p className="text-gray-600 mb-4">
              L'identifiant du document est manquant dans l'URL.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              URL actuelle: {window.location.href}
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

  // État de chargement avec plus d'informations
  if (loading) {
    console.log("⏳ PdfViewer - Loading document:", documentId);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">Chargement du document</h2>
            <p className="text-gray-600 mb-2">Document ID: {documentId}</p>
            <p className="text-sm text-gray-500">Tentative {retryCount + 1}/3</p>
            
            {/* Bouton d'annulation pour les tests */}
            <button 
              onClick={() => window.location.href = '/mes-directives'}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
            >
              Annuler et retourner
            </button>
          </div>
        </div>
      </div>
    );
  }

  // État d'erreur ou document non trouvé avec debug info
  if (error || !document) {
    console.error("❌ PdfViewer - Error or no document:", { 
      error, 
      hasDocument: !!document,
      documentId 
    });
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-xl font-bold text-red-600 mb-4 text-center">
              Document inaccessible
            </h1>
            
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <h3 className="font-medium text-red-800 mb-2">Erreur:</h3>
                <p className="text-sm text-red-700">
                  {error || 'Document non trouvé'}
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-medium text-blue-800 mb-2">Informations de debug:</h3>
                <div className="text-xs text-blue-700 space-y-1">
                  <div><strong>Document ID:</strong> {documentId}</div>
                  <div><strong>Tentatives:</strong> {retryCount + 1}/3</div>
                  <div><strong>URL complète:</strong> {window.location.href}</div>
                  <div><strong>Paramètres:</strong> {new URLSearchParams(window.location.search).toString()}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleRetry}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={retryCount >= 2}
                >
                  {retryCount >= 2 ? 'Maximum de tentatives atteint' : `Réessayer (${retryCount + 1}/3)`}
                </button>
                
                <button 
                  onClick={() => window.location.href = '/mes-directives'}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Retour à mes directives
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si navigateur externe, afficher la vue spéciale
  if (isExternalBrowser) {
    console.log("📱 PdfViewer - Rendering external browser view");
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
  console.log("✅ PdfViewer - Rendering normal view with document:", document.file_name);
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
