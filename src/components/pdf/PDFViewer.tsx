
import { useEffect, useState } from "react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [sanitizedUrl, setSanitizedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (pdfUrl) {
      try {
        // Nettoyer et normaliser l'URL du PDF
        let cleanUrl = pdfUrl.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
        console.log("[PDFViewer] Original URL:", pdfUrl.substring(0, 50) + "...");
        console.log("[PDFViewer] Cleaned URL:", cleanUrl.substring(0, 50) + "...");
        
        // S'assurer que c'est une URL de données valide
        if (!cleanUrl.startsWith('data:application/pdf')) {
          console.warn("[PDFViewer] URL may not be a valid PDF data URL format:", cleanUrl.substring(0, 50) + "...");
          // On continue quand même car certains navigateurs peuvent gérer d'autres formats
        }
        
        setSanitizedUrl(cleanUrl);
        setErrorMessage(null);
      } catch (error) {
        console.error("[PDFViewer] Error processing PDF URL:", error);
        setErrorMessage("Erreur lors du traitement du PDF");
        setSanitizedUrl(null);
      }
    } else {
      setSanitizedUrl(null);
      setErrorMessage(null);
    }
  }, [pdfUrl]);

  if (errorMessage) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 flex-col">
        <p className="font-semibold mb-2">Erreur</p>
        <p>{errorMessage}</p>
      </div>
    );
  }

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
        onError={(e) => {
          console.error("[PDFViewer] Error loading PDF in iframe:", e);
          setErrorMessage("Impossible de charger le PDF");
        }}
      />
    </div>
  );
}
