
import React, { useEffect, useState } from 'react';

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfUrl) {
      // Use Google PDF Viewer as a fallback for better compatibility
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
      
      // First try to use the direct URL, the browser might have a PDF viewer
      setViewerUrl(pdfUrl);
      
      // If direct URL doesn't work after 3 seconds, switch to Google Viewer
      const fallbackTimer = setTimeout(() => {
        console.log("Switching to Google PDF Viewer fallback");
        setViewerUrl(googleViewerUrl);
      }, 3000);
      
      return () => clearTimeout(fallbackTimer);
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
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
    />
  );
};
