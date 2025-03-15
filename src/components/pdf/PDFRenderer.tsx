
import React, { useRef } from 'react';

interface PDFRendererProps {
  url: string | null;
  onLoad: () => void;
  onError: () => void;
  retryCount: number;
}

export function PDFRenderer({ url, onLoad, onError, retryCount }: PDFRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={url}
      className="w-full h-full border-0"
      title="PDF Preview"
      onLoad={onLoad}
      onError={onError}
      key={`pdf-iframe-${retryCount}`} // Force re-render on retry
    />
  );
}
