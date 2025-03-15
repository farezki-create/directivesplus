
import React, { useRef } from 'react';

interface PDFRendererProps {
  url: string | null;
  onLoad: () => void;
  onError: () => void;
  retryCount: number;
  renderMethod?: 'iframe' | 'object' | 'embed';
}

export function PDFRenderer({ url, onLoad, onError, retryCount, renderMethod = 'iframe' }: PDFRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  // Different rendering methods for better compatibility
  if (renderMethod === 'object') {
    return (
      <object
        data={url}
        type="application/pdf"
        className="w-full h-full"
        onLoad={onLoad}
        onError={onError}
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
    );
  }
  
  if (renderMethod === 'embed') {
    return (
      <embed
        src={url}
        type="application/pdf"
        className="w-full h-full"
        onLoad={onLoad}
        key={`pdf-embed-${retryCount}`}
      />
    );
  }

  // Default: iframe method
  return (
    <iframe
      src={url}
      className="w-full h-full border-0"
      title="PDF Preview"
      onLoad={onLoad}
      onError={onError}
      key={`pdf-iframe-${retryCount}`}
    />
  );
}
