
import { useEffect, useState } from "react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [sanitizedUrl, setSanitizedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    if (!pdfUrl) {
      setSanitizedUrl(null);
      setErrorMessage(null);
      return;
    }
    
    try {
      console.log("[PDFViewer] Processing PDF URL of length:", pdfUrl.length);
      console.log("[PDFViewer] URL Type:", typeof pdfUrl);
      
      // Basic validation - ensure we have a non-empty string
      if (typeof pdfUrl !== 'string' || pdfUrl.trim() === '') {
        throw new Error("Invalid PDF URL format: empty or not a string");
      }
      
      // Verify this is a data URL for a PDF
      if (!pdfUrl.startsWith('data:application/pdf') && 
          !pdfUrl.startsWith('blob:') && 
          !pdfUrl.startsWith('http')) {
        console.warn("[PDFViewer] URL may not be in expected format:", pdfUrl.substring(0, 30) + "...");
      }
      
      // Clean any double slashes (except in protocol part)
      let cleanUrl = pdfUrl.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
      
      if (cleanUrl !== pdfUrl) {
        console.log("[PDFViewer] URL was cleaned, original length:", pdfUrl.length);
      }
      
      setSanitizedUrl(cleanUrl);
      setErrorMessage(null);
    } catch (error) {
      console.error("[PDFViewer] Error processing PDF URL:", error);
      setErrorMessage("Erreur lors du traitement du PDF");
      setSanitizedUrl(null);
      
      // If this is the first error, try one more time with a delay
      if (retryCount === 0) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          if (pdfUrl) {
            console.log("[PDFViewer] Retrying PDF processing");
            try {
              setSanitizedUrl(pdfUrl);
              setErrorMessage(null);
            } catch (retryError) {
              console.error("[PDFViewer] Retry failed:", retryError);
              setErrorMessage("Échec de l'affichage du PDF après nouvelle tentative");
            }
          }
        }, 1000);
      }
    }
  }, [pdfUrl, retryCount]);

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
