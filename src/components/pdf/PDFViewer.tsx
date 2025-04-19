
import React, { useEffect, useState } from 'react';

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    if (pdfUrl) {
      // Réinitialiser les états en cas de changement de PDF
      setRenderError(false);
      
      // Vérifie si l'URL est une data URL (commence par data:)
      const isDataUrl = pdfUrl.startsWith('data:');
      
      if (isDataUrl) {
        // Pour les data URLs, utiliser uniquement la visualisation directe
        // sans essayer Google Viewer (qui génère l'erreur 400)
        console.log("Using direct rendering for data URL");
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

  // Gestionnaire d'erreur pour l'iframe
  const handleIframeError = () => {
    console.error("Error loading PDF in iframe");
    setRenderError(true);
  };

  if (!viewerUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si une erreur est détectée, afficher un message d'erreur avec options
  if (renderError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Impossible d'afficher le PDF directement</p>
          <p className="text-gray-600">Le document PDF ne peut pas être affiché dans le navigateur.</p>
          
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => window.open(viewerUrl, '_blank')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Ouvrir dans un nouvel onglet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={viewerUrl}
      className="w-full h-full rounded-lg"
      title="PDF Viewer"
      sandbox={useGoogleViewer ? "allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation" : undefined}
      onError={handleIframeError}
    />
  );
};
