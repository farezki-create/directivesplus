
import React, { useRef, useEffect, useState } from 'react';

interface PDFRendererProps {
  url: string | null;
  onLoad: () => void;
  onError: () => void;
  retryCount: number;
  renderMethod?: 'iframe' | 'object' | 'embed';
}

export function PDFRenderer({ url, onLoad, onError, retryCount, renderMethod = 'iframe' }: PDFRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  
  // Reset error state when URL or render method changes
  useEffect(() => {
    setHasError(false);
    console.log(`[PDFRenderer] Rendering with method: ${renderMethod}, URL present: ${!!url}, retry: ${retryCount}`);
  }, [url, renderMethod, retryCount]);

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  const handleError = () => {
    console.error(`[PDFRenderer] Error rendering PDF with method: ${renderMethod}`);
    setHasError(true);
    onError();
  };

  const handleLoad = () => {
    console.log(`[PDFRenderer] Successfully loaded PDF with method: ${renderMethod}`);
    setHasError(false);
    onLoad();
  };

  // Different rendering methods for better compatibility
  if (renderMethod === 'object') {
    return (
      <div className="w-full h-full" ref={containerRef}>
        <object
          data={url}
          type="application/pdf"
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
          key={`pdf-object-${retryCount}`}
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center gap-2">
            <p>Impossible d'afficher le PDF dans votre navigateur.</p>
            <button 
              onClick={() => window.open(url, '_blank')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ouvrir dans un nouvel onglet
            </button>
          </div>
        </object>
      </div>
    );
  }
  
  if (renderMethod === 'embed') {
    return (
      <div className="w-full h-full" ref={containerRef}>
        <embed
          src={url}
          type="application/pdf"
          className="w-full h-full"
          key={`pdf-embed-${retryCount}`}
          onLoad={handleLoad}
          onError={handleError}
        />
        {hasError && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4">
            <p className="text-red-600 mb-2">Problème d'affichage du PDF</p>
            <div className="flex space-x-2">
              <button 
                onClick={() => window.open(url, '_blank')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ouvrir dans un nouvel onglet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: iframe method with error handling
  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="PDF Preview"
        onLoad={handleLoad}
        onError={handleError}
        key={`pdf-iframe-${retryCount}`}
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
      />
      {hasError && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4">
          <p className="text-red-600 mb-2">Problème d'affichage du PDF</p>
          <div className="flex space-x-2">
            <button 
              onClick={() => window.open(url, '_blank')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ouvrir dans un nouvel onglet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
