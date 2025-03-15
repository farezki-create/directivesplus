
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const isMobile = useIsMobile();
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (pdfUrl) {
      // Enhanced URL cleaning and validation
      try {
        // Remove any double slashes except in protocol
        let cleaned = pdfUrl.replace(/([^:])\/\/+/g, '$1/');
        
        // Fix protocol if needed
        if (cleaned.includes(':') && !cleaned.includes('://')) {
          cleaned = cleaned.replace(/:\//g, '://');
        }
        
        // Log the cleaned URL for debugging
        console.log("[PDFViewer] Original URL:", pdfUrl);
        console.log("[PDFViewer] Cleaned URL:", cleaned);
        
        // Ensure URL is valid (will throw if not)
        new URL(cleaned);
        
        setCleanUrl(cleaned);
      } catch (error) {
        console.error("[PDFViewer] Invalid URL format:", error);
        console.log("[PDFViewer] Trying to use URL as-is");
        setCleanUrl(pdfUrl); // Fallback to using original URL
      }
    } else {
      setCleanUrl(null);
    }
  }, [pdfUrl]);
  
  // Additional debugging
  useEffect(() => {
    if (cleanUrl) {
      console.log("[PDFViewer] Rendering iframe with URL:", cleanUrl);
    }
  }, [cleanUrl]);
  
  if (!cleanUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  return (
    <div className={`flex-1 ${isMobile ? 'min-h-[60vh]' : 'min-h-[75vh]'} border rounded overflow-hidden`}>
      <iframe
        src={cleanUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
        id="pdf-viewer-iframe"
        allow="fullscreen"
        loading="eager"
        onLoad={() => console.log("[PDFViewer] iframe loaded")}
        onError={(e) => console.error("[PDFViewer] iframe error:", e)}
      />
    </div>
  );
}
