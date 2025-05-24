
import React from "react";
import { Navigate } from "react-router-dom";
import { usePdfViewerState } from "@/hooks/usePdfViewerState";
import ExternalBrowserView from "./ExternalBrowserView";
import PdfViewerContent from "./PdfViewerContent";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

const PdfViewerContainer = () => {
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

  if (!documentId) {
    return <Navigate to="/mes-directives" replace />;
  }

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

  if (loading) {
    return <LoadingState retryCount={retryCount} />;
  }

  if (error || !document) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

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

export default PdfViewerContainer;
