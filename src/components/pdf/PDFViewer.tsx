
import { useEffect, useState } from "react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [sanitizedUrl, setSanitizedUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (pdfUrl) {
      // Nettoyer et normaliser l'URL du PDF
      let cleanUrl = pdfUrl.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
      
      // S'assurer que c'est une URL de données valide
      if (!cleanUrl.startsWith('data:application/pdf')) {
        console.warn("[PDFViewer] Invalid PDF URL format:", cleanUrl.substring(0, 50) + "...");
      }
      
      setSanitizedUrl(cleanUrl);
    } else {
      setSanitizedUrl(null);
    }
  }, [pdfUrl]);

  if (!sanitizedUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[700px] border rounded">
      <iframe
        src={sanitizedUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
        id="pdf-viewer-iframe"
        allow="fullscreen"
        loading="eager"
      />
    </div>
  );
}
