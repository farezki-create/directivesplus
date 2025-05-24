
import { useSearchParams, Navigate } from "react-router-dom";
import { useBrowserDetection } from "@/hooks/useBrowserDetection";
import { useDocumentLoader } from "@/hooks/useDocumentLoader";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { useDocumentPrint } from "@/hooks/useDocumentPrint";

export const usePdfViewerState = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('id');
  
  const { isExternalBrowser } = useBrowserDetection();
  const { document, loading, error, retryCount, setRetryCount, setError } = useDocumentLoader(documentId);
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  const handleDownloadPdf = () => {
    if (document) {
      handleDownload(document.file_path, document.file_name);
    }
  };

  const handlePrintPdf = () => {
    if (document) {
      handlePrint(document.file_path, document.content_type);
    }
  };

  const handleOpenExternal = () => {
    if (document) {
      window.open(document.file_path, '_blank');
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return {
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
  };
};
