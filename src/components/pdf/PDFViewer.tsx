
import React, { useEffect, useRef, useState } from 'react';

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isDataUrl, setIsDataUrl] = useState(false);

  useEffect(() => {
    if (pdfUrl) {
      // Réinitialiser les états en cas de changement de PDF
      setRenderError(false);
      
      // Vérifie si l'URL est une data URL (commence par data:)
      const isDataUrlPdf = pdfUrl.startsWith('data:');
      setIsDataUrl(isDataUrlPdf);
      
      if (isDataUrlPdf) {
        // Pour les data URLs, utiliser uniquement la visualisation directe
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

  // Fonction pour ouvrir le PDF dans une nouvelle fenêtre
  const openInNewTab = () => {
    if (viewerUrl) {
      // Si c'est une data URL et qu'elle est très longue, nous devons utiliser
      // une approche différente car certains navigateurs ont des limites de longueur d'URL
      if (isDataUrl && viewerUrl.length > 1500000) {
        // Créer un objet Blob à partir de la data URL
        try {
          // Extraire la partie base64 de la data URL
          const base64Content = viewerUrl.split(',')[1];
          // Convertir la base64 en Blob
          const byteCharacters = atob(base64Content);
          const byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          
          const blob = new Blob(byteArrays, {type: 'application/pdf'});
          const blobUrl = URL.createObjectURL(blob);
          
          // Ouvrir dans une nouvelle fenêtre
          window.open(blobUrl, '_blank');
        } catch (e) {
          console.error("Error creating blob from data URL:", e);
          // Fallback - essayer d'ouvrir directement
          window.open(viewerUrl, '_blank');
        }
      } else {
        // Pour les URLs normales ou les data URLs courtes
        window.open(viewerUrl, '_blank');
      }
    }
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
              onClick={openInNewTab}
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
      ref={iframeRef}
      src={viewerUrl}
      className="w-full h-full rounded-lg"
      title="PDF Viewer"
      sandbox={useGoogleViewer ? "allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation" : undefined}
      onError={handleIframeError}
    />
  );
};
