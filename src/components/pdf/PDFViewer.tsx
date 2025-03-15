
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState, useRef } from "react";

interface PDFViewerProps {
  pdfUrl: string | null;
  onLoadError?: () => void;
  onLoadSuccess?: () => void;
}

export function PDFViewer({ pdfUrl, onLoadError, onLoadSuccess }: PDFViewerProps) {
  const isMobile = useIsMobile();
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!pdfUrl) {
      console.log("[PDFViewer] No PDF URL provided");
      setCleanUrl(null);
      setLoadError(false);
      return;
    }
    
    try {
      console.log("[PDFViewer] Processing PDF URL:", pdfUrl.substring(0, 50) + "...");
      
      // Reset error state when URL changes
      setLoadError(false);
      setIsLoading(true);
      
      // For data URLs, use them directly
      if (pdfUrl.startsWith('data:application/pdf;base64,')) {
        console.log("[PDFViewer] Using data URL directly");
        setCleanUrl(pdfUrl);
        return;
      }
      
      // For non-data URLs, clean them
      // Remove any double slashes except in protocol
      let cleaned = pdfUrl.replace(/([^:])\/\/+/g, '$1/');
      
      // Fix protocol if needed
      if (cleaned.includes(':') && !cleaned.includes('://')) {
        cleaned = cleaned.replace(/:\//g, '://');
      }
      
      console.log("[PDFViewer] Original URL:", pdfUrl);
      console.log("[PDFViewer] Cleaned URL:", cleaned);
      
      setCleanUrl(cleaned);
    } catch (error) {
      console.error("[PDFViewer] Invalid URL format:", error);
      
      // For data URLs that might have been corrupted by string handling,
      // try to use the original URL
      if (pdfUrl.includes('data:application/pdf;base64,')) {
        console.log("[PDFViewer] Attempting to use original data URL");
        setCleanUrl(pdfUrl);
      } else {
        console.error("[PDFViewer] Cannot display PDF, invalid URL");
        setCleanUrl(null);
        setLoadError(true);
        if (onLoadError) onLoadError();
      }
    }
  }, [pdfUrl, onLoadError]);

  // Monitor iframe load events to detect success/failure
  const handleIframeLoad = () => {
    console.log("[PDFViewer] iframe loaded successfully");
    setLoadError(false);
    setIsLoading(false);
    if (onLoadSuccess) onLoadSuccess();
  };
  
  const handleIframeError = () => {
    console.error("[PDFViewer] iframe failed to load PDF");
    setLoadError(true);
    setIsLoading(false);
    if (onLoadError) onLoadError();
  };

  // Setup a timeout to detect loading issues
  useEffect(() => {
    if (!cleanUrl || !isLoading) return;
    
    const timeoutId = setTimeout(() => {
      // If still loading after timeout, consider it an error
      if (isLoading) {
        console.log("[PDFViewer] PDF load timeout reached");
        setLoadError(true);
        setIsLoading(false);
        if (onLoadError) onLoadError();
      }
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [cleanUrl, isLoading, onLoadError]);

  // Simple pdf viewer fallback using iframe
  const renderPdfViewer = () => {
    if (!cleanUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Aucun document à afficher
        </div>
      );
    }

    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={cleanUrl}
          className="w-full h-full border-0"
          title="PDF Preview"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          key={`pdf-iframe-${retryCount}`} // Force re-render on retry
        />
      </>
    );
  };

  return (
    <div className={`relative w-full h-full ${isMobile ? 'min-h-[60vh]' : 'min-h-[75vh]'} border rounded overflow-hidden`}>
      {renderPdfViewer()}
    </div>
  );
}
