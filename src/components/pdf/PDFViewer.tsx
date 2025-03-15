
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { usePDFUrl } from "./hooks/usePDFUrl";
import { PDFErrorHandler } from "./PDFErrorHandler";
import { PDFLoadingIndicator } from "./PDFLoadingIndicator";
import { PDFRenderer } from "./PDFRenderer";

interface PDFViewerProps {
  pdfUrl: string | null;
  onLoadError?: () => void;
  onLoadSuccess?: () => void;
}

export function PDFViewer({ pdfUrl, onLoadError, onLoadSuccess }: PDFViewerProps) {
  const isMobile = useIsMobile();
  const { cleanUrl, loadError, setLoadError } = usePDFUrl(pdfUrl);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [renderMethod, setRenderMethod] = useState<'iframe' | 'object' | 'embed'>('iframe');
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    console.log("[PDFViewer] PDF content loaded successfully with method:", renderMethod);
    setLoadError(false);
    setIsLoading(false);
    if (onLoadSuccess) onLoadSuccess();
  };
  
  const handleIframeError = () => {
    console.error(`[PDFViewer] Failed to load PDF with method: ${renderMethod}`);
    
    // Try another rendering method if current one fails
    if (renderMethod === 'iframe' && retryCount < 1) {
      console.log("[PDFViewer] Switching to object tag rendering");
      setRenderMethod('object');
      setRetryCount(prev => prev + 1);
      return;
    } else if (renderMethod === 'object' && retryCount < 2) {
      console.log("[PDFViewer] Switching to embed tag rendering");
      setRenderMethod('embed');
      setRetryCount(prev => prev + 1);
      return;
    }
    
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
        
        // Try next render method on timeout
        if (renderMethod === 'iframe' && retryCount < 1) {
          console.log("[PDFViewer] Timeout - switching to object tag");
          setRenderMethod('object');
          setRetryCount(prev => prev + 1);
          return;
        } else if (renderMethod === 'object' && retryCount < 2) {
          console.log("[PDFViewer] Timeout - switching to embed tag");
          setRenderMethod('embed');
          setRetryCount(prev => prev + 1);
          return;
        }
        
        setLoadError(true);
        setIsLoading(false);
        if (onLoadError) onLoadError();
      }
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [cleanUrl, isLoading, onLoadError, renderMethod, retryCount]);

  // Reset loading state when URL changes or render method changes
  useEffect(() => {
    setIsLoading(true);
  }, [cleanUrl, renderMethod]);

  // Error handling functions
  const handleRetry = () => {
    console.log("[PDFViewer] Retrying PDF load");
    setRetryCount(0); // Reset to start with iframe again
    setRenderMethod('iframe');
    setLoadError(false);
    setIsLoading(true);
  };

  const handleDirectDownload = () => {
    if (cleanUrl) {
      console.log("[PDFViewer] Direct download initiated");
      const link = document.createElement('a');
      link.href = cleanUrl;
      link.download = 'directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openInNewTab = () => {
    if (cleanUrl) {
      console.log("[PDFViewer] Opening PDF in new tab");
      window.open(cleanUrl, '_blank');
    }
  };

  return (
    <div className={`relative w-full h-full ${isMobile ? 'min-h-[60vh]' : 'min-h-[75vh]'} border rounded overflow-hidden`}>
      <PDFLoadingIndicator isLoading={isLoading} />
      
      <PDFErrorHandler 
        isVisible={loadError}
        onRetry={handleRetry}
        onDirectDownload={handleDirectDownload}
        onOpenInNewTab={openInNewTab}
      />
      
      <PDFRenderer 
        url={cleanUrl}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        retryCount={retryCount}
        renderMethod={renderMethod}
      />
    </div>
  );
}
