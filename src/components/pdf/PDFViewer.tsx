
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState, useRef } from "react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const isMobile = useIsMobile();
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);
  
  useEffect(() => {
    if (!pdfUrl) {
      console.log("[PDFViewer] No PDF URL provided");
      setCleanUrl(null);
      return;
    }
    
    try {
      console.log("[PDFViewer] Processing PDF URL:", pdfUrl.substring(0, 50) + "...");
      
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
      
      // Ensure URL is valid (will throw if not)
      new URL(cleaned);
      
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
      }
    }
  }, [pdfUrl]);
  
  // Log when iframe is about to render
  useEffect(() => {
    if (cleanUrl) {
      console.log("[PDFViewer] About to render PDF with URL type:", 
        cleanUrl.startsWith('data:') ? 'data URL' : 'regular URL');
      console.log("[PDFViewer] URL starts with:", cleanUrl.substring(0, 30) + "...");
    }
  }, [cleanUrl]);
  
  // Handle PDF loading errors
  useEffect(() => {
    const handleObjectError = () => {
      console.error("[PDFViewer] Object tag failed to load PDF");
      if (iframeRef.current) {
        console.log("[PDFViewer] Attempting to use iframe as fallback");
      }
    };

    const handleIframeLoad = () => {
      console.log("[PDFViewer] iframe loaded successfully");
    };

    const objectElement = objectRef.current;
    const iframeElement = iframeRef.current;

    if (objectElement) {
      objectElement.addEventListener('error', handleObjectError);
    }

    if (iframeElement) {
      iframeElement.addEventListener('load', handleIframeLoad);
    }

    return () => {
      if (objectElement) {
        objectElement.removeEventListener('error', handleObjectError);
      }
      if (iframeElement) {
        iframeElement.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [cleanUrl]);
  
  if (!cleanUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  return (
    <div className={`flex-1 ${isMobile ? 'min-h-[60vh]' : 'min-h-[75vh]'} border rounded overflow-hidden relative w-full h-full`}>
      {/* Primary method: embed using object tag */}
      <object
        ref={objectRef}
        data={cleanUrl}
        type="application/pdf"
        className="w-full h-full absolute inset-0"
        title="PDF Preview"
        id="pdf-viewer-object"
      >
        {/* Fallback: iframe */}
        <iframe
          ref={iframeRef}
          src={`${cleanUrl}#toolbar=0&navpanes=0`}
          className="w-full h-full border-0 absolute inset-0"
          title="PDF Preview"
          id="pdf-viewer-iframe"
          allow="fullscreen"
          loading="eager"
          onLoad={() => console.log("[PDFViewer] iframe loaded")}
          onError={(e) => console.error("[PDFViewer] iframe error:", e)}
        />
      </object>
      
      {/* Emergency fallback: link to PDF */}
      <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-75 p-2 rounded hidden data-[visible=true]:block" data-visible={!objectRef.current && !iframeRef.current}>
        <a 
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm flex justify-center"
        >
          Ouvrir le PDF dans un nouvel onglet
        </a>
      </div>
    </div>
  );
}
