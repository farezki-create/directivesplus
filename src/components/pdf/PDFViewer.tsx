
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isDataUrl, setIsDataUrl] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (pdfUrl) {
      try {
        // Reset states when PDF changes
        setRenderError(false);
        
        // Check if it's a data URL
        const isDataUrlFormat = pdfUrl.startsWith('data:application/pdf');
        setIsDataUrl(isDataUrlFormat);
        
        // Set the URL for viewing
        setViewerUrl(pdfUrl);
      } catch (error) {
        console.error("Error processing PDF URL:", error);
        setRenderError(true);
      }
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
        // For regular URLs, just open in a new window
        if (!isDataUrl) {
          window.open(pdfUrl, '_blank');
          return;
        }
        
        // For data URLs, we need to be careful
        // Create a new window/tab with a simple HTML page that embeds the PDF
        const newWindow = window.open('', '_blank');
        if (!newWindow) {
          throw new Error("Le navigateur a bloqué l'ouverture d'une nouvelle fenêtre");
        }
        
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Document PDF</title>
              <style>
                body, html { margin: 0; padding: 0; height: 100%; }
                embed { width: 100%; height: 100%; }
              </style>
            </head>
            <body>
              <embed src="${pdfUrl}" type="application/pdf" />
            </body>
          </html>
        `);
        newWindow.document.close();
      } catch (e) {
        console.error("Error opening PDF:", e);
        toast({
          title: "Erreur d'ouverture",
          description: "Impossible d'ouvrir le document PDF",
          variant: "destructive",
        });
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
            <Button 
              onClick={openInNewTab}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Ouvrir dans un nouvel onglet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For data URLs, we use object tag which handles them better than iframe
  if (isDataUrl) {
    return (
      <div className="w-full h-full">
        <object
          data={viewerUrl}
          type="application/pdf"
          className="w-full h-full rounded-lg"
          onError={() => setRenderError(true)}
        >
          <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-red-500 font-medium">Impossible d'afficher le PDF directement</p>
            <Button 
              onClick={openInNewTab}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Ouvrir dans un nouvel onglet
            </Button>
          </div>
        </object>
      </div>
    );
  }

  // For regular URLs, use iframe with better error handling
  return (
    <div className="w-full h-full relative">
      <iframe
        ref={iframeRef}
        src={viewerUrl}
        className="w-full h-full rounded-lg"
        title="PDF Viewer"
        onError={handleIframeError}
      />
      {/* Add a fallback option that's always visible */}
      <div className="absolute top-2 right-2">
        <Button 
          onClick={openInNewTab}
          size="sm"
          variant="secondary"
          className="flex items-center gap-1"
        >
          <ExternalLink size={14} />
          Nouvel onglet
        </Button>
      </div>
    </div>
  );
};
