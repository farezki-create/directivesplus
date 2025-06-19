
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";

interface PdfPreviewProps {
  filePath: string;
}

const PdfPreview = ({ filePath }: PdfPreviewProps) => {
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLoadError(false);
    setIsLoading(true);
  }, [filePath]);

  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  const handleOpenExternal = () => {
    window.open(filePath, '_blank');
  };

  const handleRetry = () => {
    setLoadError(false);
    setIsLoading(true);
    // Force reload by changing the src
    const iframe = document.querySelector('iframe[data-pdf-preview]') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = filePath + '?reload=' + Date.now();
    }
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-6">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Impossible d'afficher le PDF
          </h3>
          <p className="text-gray-600 mb-4">
            Le document ne peut pas être prévisualisé dans cette fenêtre.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
            <Button onClick={handleOpenExternal} size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir dans un nouvel onglet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du document...</p>
          </div>
        </div>
      )}
      
      <iframe 
        data-pdf-preview
        src={filePath}
        className="w-full h-full border-none"
        title="Prévisualisation PDF"
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
      
      {!isLoading && !loadError && (
        <div className="absolute top-2 right-2 z-20">
          <Button
            onClick={handleOpenExternal}
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white shadow-sm"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Ouvrir
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfPreview;
