
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
      // Clean the URL to remove any double slashes except in protocol
      const cleaned = pdfUrl.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
      console.log("[PDFViewer] Cleaned URL:", cleaned);
      setCleanUrl(cleaned);
    } else {
      setCleanUrl(null);
    }
  }, [pdfUrl]);
  
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
      />
    </div>
  );
}
