
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, RefreshCw } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const isMobile = useIsMobile();
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
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
      }
    }
  }, [pdfUrl]);

  // Monitor iframe load events to detect success/failure
  const handleIframeLoad = () => {
    console.log("[PDFViewer] iframe loaded successfully");
    setLoadError(false);
  };
  
  const handleIframeError = () => {
    console.error("[PDFViewer] iframe failed to load PDF");
    setLoadError(true);
  };

  const handleRetry = () => {
    if (!cleanUrl) return;
    
    console.log("[PDFViewer] Retrying PDF load with count:", retryCount + 1);
    setRetryCount(prev => prev + 1);
    setLoadError(false);
    
    // Add a timestamp parameter to force reload
    const timestamp = new Date().getTime();
    let urlToReload = cleanUrl;
    
    // Only add timestamp to non-data URLs
    if (!urlToReload.startsWith('data:')) {
      urlToReload += (urlToReload.includes('?') ? '&' : '?') + `t=${timestamp}`;
    }
    
    // Force reload the iframe
    if (iframeRef.current) {
      // First clear the iframe source completely
      iframeRef.current.src = 'about:blank';
      
      // Then after a delay, set the new URL
      setTimeout(() => {
        if (iframeRef.current) {
          console.log("[PDFViewer] Setting new iframe URL after reset");
          iframeRef.current.src = urlToReload;
        }
      }, 200); // Increased delay to ensure proper reset
    }
  };
  
  const handleDownload = () => {
    if (cleanUrl) {
      console.log("[PDFViewer] Downloading PDF");
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
        <iframe
          ref={iframeRef}
          src={cleanUrl}
          className="w-full h-full border-0"
          title="PDF Preview"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          key={`pdf-iframe-${retryCount}`} // Force re-render on retry
        />
        
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95">
            <div className="text-center p-6 max-w-md space-y-4">
              <p className="text-red-500 font-medium text-lg mb-2">
                Le PDF n'a pas pu être chargé
              </p>
              <p className="text-gray-600 mb-4">
                Il se peut que la page web à l'adresse demandée soit temporairement indisponible.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Réessayer
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger le PDF
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={openInNewTab}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`relative w-full h-full ${isMobile ? 'min-h-[60vh]' : 'min-h-[75vh]'} border rounded overflow-hidden`}>
      {renderPdfViewer()}
    </div>
  );
}
