
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

  console.log("PdfViewer - État:", {
    documentId,
    isExternalBrowser,
    hasDocument: !!document,
    loading,
    error
  });

  // Si pas d'ID de document, erreur
  if (!documentId) {
    return (
      <ErrorState 
        error="ID du document manquant"
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    );
  }

  // État de chargement
  if (loading) {
    return <LoadingState />;
  }

  // État d'erreur
  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
        retryCount={retryCount}
      />
    );
  }

  // Si navigateur externe, afficher la vue spéciale
  if (isExternalBrowser) {
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
