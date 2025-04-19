
import React, { useEffect, useState } from 'react';

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);

  useEffect(() => {
    if (pdfUrl) {
      // Vérifie si l'URL est une data URL (commence par data:)
      const isDataUrl = pdfUrl.startsWith('data:');
      
      if (isDataUrl) {
        // Pour les data URLs, utiliser uniquement la visualisation directe
        // sans essayer Google Viewer (qui génère l'erreur 400)
        setViewerUrl(pdfUrl);
        setUseGoogleViewer(false);
      } else {
        // Pour les URLs normales, utiliser d'abord l'URL directe
        setViewerUrl(pdfUrl);
        
        // Si l'URL directe ne fonctionne pas après 3 secondes, essayer Google Viewer
        // Uniquement pour les URLs normales (non-data URLs)
        const fallbackTimer = setTimeout(() => {
          console.log("Switching to Google PDF Viewer fallback");
          const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
          setViewerUrl(googleViewerUrl);
          setUseGoogleViewer(true);
        }, 3000);
        
        return () => clearTimeout(fallbackTimer);
      }
    }
  }, [pdfUrl]);

  if (!viewerUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <iframe
      src={viewerUrl}
      className="w-full h-full rounded-lg"
      title="PDF Viewer"
      sandbox={useGoogleViewer ? "allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation" : undefined}
    />
  );
};
