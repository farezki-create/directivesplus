
import React from "react";
import { usePdfViewerState } from "@/hooks/usePdfViewerState";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import PdfViewerContent from "./PdfViewerContent";
import ExternalBrowserView from "./ExternalBrowserView";

const PdfViewerContainer = () => {
  const {
    documentId,
    documentType,
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

  // Only log once when component mounts or critical state changes
  React.useEffect(() => {
    console.log("PdfViewerContainer - State:", {
      documentId,
      documentType,
      isExternalBrowser,
      hasDocument: !!document,
      loading,
      error
    });
  }, [documentId, document?.id, loading, error]);

  if (loading) {
    return <LoadingState retryCount={retryCount} />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
        retryCount={retryCount}
        documentId={documentId}
      />
    );
  }

  if (!document) {
    return (
      <ErrorState 
        error="Document non trouvé"
        onRetry={handleRetry}
        onGoBack={handleGoBack}
        retryCount={retryCount}
        documentId={documentId}
      />
    );
  }

  if (isExternalBrowser) {
    const enhancedDocument = {
      ...document,
      file_type: document.file_type || document.content_type || 'application/pdf'
    };
    
    return (
      <ExternalBrowserView
        document={enhancedDocument}
        onDownload={handleDownloadPdf}
        onPrint={handlePrintPdf}
        onOpenExternal={handleOpenExternal}
        onGoBack={handleGoBack}
      />
    );
  }

  const enhancedDocument = {
    ...document,
    file_type: document.file_type || document.content_type || 'application/pdf'
  };

  return (
    <PdfViewerContent
      document={enhancedDocument}
      onDownload={handleDownloadPdf}
      onGoBack={handleGoBack}
    />
  );
};

export default PdfViewerContainer;
