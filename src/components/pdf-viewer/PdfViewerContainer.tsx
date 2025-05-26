
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

  console.log("PdfViewerContainer - State:", {
    documentId,
    documentType,
    isExternalBrowser,
    hasDocument: !!document,
    loading,
    error
  });

  if (loading) {
    return <LoadingState />;
  }

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

  if (!document) {
    const mockDocument = {
      id: documentId || '',
      file_name: 'Document non trouvé',
      file_path: '',
      file_type: 'application/pdf',
      content_type: 'application/pdf',
      user_id: '',
      created_at: new Date().toISOString()
    };
    
    return (
      <ErrorState 
        error="Document non trouvé"
        onRetry={handleRetry}
        onGoBack={handleGoBack}
        retryCount={retryCount}
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
      onDownload={handleDownload}
      onGoBack={handleGoBack}
    />
  );
};

export default PdfViewerContainer;
