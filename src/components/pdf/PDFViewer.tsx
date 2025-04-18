
import React, { useEffect, useState } from 'react';

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfUrl) {
      setViewerUrl(pdfUrl);
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
    />
  );
};
