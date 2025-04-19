
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
      // Reset states when PDF changes
      setRenderError(false);
      setIsDataUrl(pdfUrl.startsWith('data:application/pdf'));
      
      // For Scalingo HDS, always use direct rendering
      console.log("Using direct rendering for Scalingo HDS URL");
      setViewerUrl(pdfUrl);
      setUseGoogleViewer(false);
    }
  }, [pdfUrl]);

  // Handle iframe errors
  const handleIframeError = () => {
    console.error("Error loading PDF in iframe");
    setRenderError(true);
  };

  // Function to open PDF in a new window
  const openInNewTab = () => {
    if (pdfUrl) {
      try {
        // If it's a data URL, we need to create a blob URL
        if (isDataUrl) {
          // Extract the base64 part of the data URL
          const base64Content = pdfUrl.split(',')[1];
          // Convert base64 to Blob
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
          
          // Open in a new window
          window.open(blobUrl, '_blank');
        } else {
          // For regular URLs
          window.open(pdfUrl, '_blank');
        }
      } catch (e) {
        console.error("Error opening PDF:", e);
        // Fallback - try to open directly
        window.open(pdfUrl, '_blank');
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

  // If an error is detected, show error message with options
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

  // For data URLs, we need to handle them differently
  if (isDataUrl) {
    return (
      <div className="w-full h-full">
        <object
          data={viewerUrl}
          type="application/pdf"
          className="w-full h-full rounded-lg"
        >
          <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-red-500 font-medium">Impossible d'afficher le PDF directement</p>
            <button 
              onClick={openInNewTab}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Ouvrir dans un nouvel onglet
            </button>
          </div>
        </object>
      </div>
    );
  }

  // For regular URLs, use iframe
  return (
    <iframe
      ref={iframeRef}
      src={viewerUrl}
      className="w-full h-full rounded-lg"
      title="PDF Viewer"
      onError={handleIframeError}
    />
  );
};
