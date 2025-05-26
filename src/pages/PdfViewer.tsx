
import React from "react";
import { useSearchParams } from "react-router-dom";
import { usePdfViewerState } from "@/hooks/usePdfViewerState";
import ExternalBrowserView from "@/components/pdf-viewer/ExternalBrowserView";
import LoadingState from "@/components/pdf-viewer/LoadingState";
import ErrorState from "@/components/pdf-viewer/ErrorState";
import PdfViewerContent from "@/components/pdf-viewer/PdfViewerContent";
import QRCodeDiagnostic from "@/components/debug/QRCodeDiagnostic";

const PdfViewer = () => {
  const [searchParams] = useSearchParams();
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

  // Paramètres QR code
  const accessType = searchParams.get('access');
  const userId = searchParams.get('user');
  const isQRAccess = accessType === 'card' && userId;

  console.log("🔍 PdfViewer - État de démarrage:", {
    documentId,
    accessType,
    userId,
    isQRAccess,
    isExternalBrowser,
    hasDocument: !!document,
    loading,
    error,
    retryCount,
    currentUrl: window.location.href
  });

  // Mode diagnostic pour les accès QR code qui échouent
  if (isQRAccess && !loading && (!document || error)) {
    console.log("🔍 PdfViewer - Activation du mode diagnostic pour QR code");
    return <QRCodeDiagnostic documentId={documentId || ''} userId={userId || ''} />;
  }

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
    return <LoadingState retryCount={retryCount} />;
  }

  // État d'erreur ou document non trouvé avec debug info
  if (error || !document) {
    console.error("❌ PdfViewer - Error or no document:", { 
      error, 
      hasDocument: !!document,
      documentId,
      isQRAccess
    });
    
    return <ErrorState error={error} onRetry={handleRetry} documentId={documentId} />;
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
