
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

  // Si pas d'ID de document, erreur
  if (!documentId) {
    console.error("PdfViewer - Document ID missing from URL");
    return (
      <ErrorState 
        error="ID du document manquant dans l'URL"
        onRetry={handleRetry}
        documentId={documentId}
      />
    );
  }

  // État de chargement
  if (loading) {
    console.log("PdfViewer - Loading document:", documentId);
    return <LoadingState retryCount={retryCount} />;
  }

  // État d'erreur
  if (error) {
    console.error("PdfViewer - Error state:", error);
    return (
      <ErrorState 
        error={error}
        onRetry={handleRetry}
        documentId={documentId}
      />
    );
  }

  // Si aucun document trouvé
  if (!document) {
    console.error("PdfViewer - No document found for ID:", documentId);
    return (
      <ErrorState 
        error="Document non trouvé"
        onRetry={handleRetry}
        documentId={documentId}
      />
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
