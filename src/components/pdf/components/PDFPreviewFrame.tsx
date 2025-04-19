
import React from 'react';

interface PDFPreviewFrameProps {
  url: string;
  onError: () => void;
}

export const PDFPreviewFrame = ({ url, onError }: PDFPreviewFrameProps) => {
  return (
    <div className="flex-grow relative min-h-[400px] bg-white rounded-lg overflow-hidden border border-gray-200">
      <iframe
        src={url}
        className="absolute inset-0 w-full h-full"
        title="Aperçu PDF"
        onError={onError}
      />
    </div>
  );
};
