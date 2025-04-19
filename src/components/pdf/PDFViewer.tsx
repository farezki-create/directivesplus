
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when URL changes
    setHasError(false);
    setIsLoading(true);
    setIframeUrl(null);
    
    if (!pdfUrl) {
      setIsLoading(false);
      return;
    }
    
    // Process PDF URL
    try {
      // For data URLs, convert to blob URL for better browser compatibility
      if (pdfUrl.startsWith('data:application/pdf')) {
        fetch(pdfUrl)
          .then(response => response.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            setIframeUrl(url);
            setIsLoading(false);
          })
          .catch(err => {
            console.error("Error processing PDF URL:", err);
            setHasError(true);
            setIsLoading(false);
          });
      } else {
        // Use the URL directly if it's not a data URL
        setIframeUrl(pdfUrl);
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Error handling PDF URL:", e);
      setHasError(true);
      setIsLoading(false);
    }
  }, [pdfUrl]);

  // Function to open the PDF in a new tab
  const openInNewTab = () => {
    const urlToOpen = iframeUrl || pdfUrl;
    
    if (!urlToOpen) {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible à afficher",
        variant: "destructive",
      });
      return;
    }
    
    window.open(urlToOpen, '_blank');
  };

  // Function to download the PDF
  const downloadPdf = () => {
    const urlToUse = iframeUrl || pdfUrl;
    
    if (!urlToUse) {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible à télécharger",
        variant: "destructive",
      });
      return;
    }
    
    const link = document.createElement('a');
    link.href = urlToUse;
    link.download = "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement",
      description: "Le PDF a été téléchargé avec succès",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {iframeUrl && !hasError ? (
        <div className="flex flex-col h-full">
          <div className="flex-grow relative rounded-lg overflow-hidden border border-gray-200">
            <iframe 
              src={iframeUrl}
              className="w-full h-full"
              title="PDF Viewer"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
          
          <div className="mt-4 flex justify-center space-x-4">
            <Button 
              onClick={openInNewTab}
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Ouvrir dans un nouvel onglet
            </Button>
            
            <Button 
              onClick={downloadPdf}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Télécharger le PDF
            </Button>
          </div>
        </div>
      ) : (
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
              
              <Button 
                onClick={downloadPdf}
                variant="outline"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Télécharger le PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
