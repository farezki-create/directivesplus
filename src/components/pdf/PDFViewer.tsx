
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState, useRef } from "react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const isMobile = useIsMobile();
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadError, setLoadError] = useState(false);
  
  useEffect(() => {
    if (!pdfUrl) {
      console.log("[PDFViewer] No PDF URL provided");
      setCleanUrl(null);
      setLoadError(false);
      return;
    }
    
    try {
      console.log("[PDFViewer] Processing PDF URL:", pdfUrl.substring(0, 50) + "...");
      
      // For data URLs, use them directly
      if (pdfUrl.startsWith('data:application/pdf;base64,')) {
        console.log("[PDFViewer] Using data URL directly");
        setCleanUrl(pdfUrl);
        setLoadError(false);
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
      setLoadError(false);
    } catch (error) {
      console.error("[PDFViewer] Invalid URL format:", error);
      
      // For data URLs that might have been corrupted by string handling,
      // try to use the original URL
      if (pdfUrl.includes('data:application/pdf;base64,')) {
        console.log("[PDFViewer] Attempting to use original data URL");
        setCleanUrl(pdfUrl);
        setLoadError(false);
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
        />
        
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
            <div className="text-center p-4">
              <p className="text-red-500 mb-2">Le PDF n'a pas pu être chargé</p>
              <a 
                href={cleanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Ouvrir le PDF dans un nouvel onglet
              </a>
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
