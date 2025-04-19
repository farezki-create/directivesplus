
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [isDataUrl, setIsDataUrl] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Réinitialiser l'état quand l'URL change
    setError(false);
    setIsLoading(false);
    setPdfBlobUrl(null);
    
    if (!pdfUrl) return;
    
    const isDataUrlFormat = pdfUrl.startsWith('data:application/pdf');
    setIsDataUrl(isDataUrlFormat);
    
    // Si c'est une data URL, convertir en Blob URL pour une meilleure compatibilité
    if (isDataUrlFormat) {
      setIsLoading(true);
      try {
        // Convertir data URL en Blob URL
        fetch(pdfUrl)
          .then(response => response.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            setPdfBlobUrl(blobUrl);
            setIsLoading(false);
          })
          .catch(err => {
            console.error("Erreur lors de la conversion data URL en Blob URL:", err);
            setError(true);
            setIsLoading(false);
          });
      } catch (e) {
        console.error("Erreur lors du traitement de l'URL du PDF:", e);
        setError(true);
        setIsLoading(false);
      }
    }
  }, [pdfUrl]);

  // Fonction pour ouvrir le PDF dans un nouvel onglet
  const openInNewTab = () => {
    // Utiliser l'URL Blob si disponible, sinon l'URL d'origine
    const urlToOpen = pdfBlobUrl || pdfUrl;
    
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

  // Fonction pour télécharger le PDF
  const downloadPdf = () => {
    const urlToUse = pdfBlobUrl || pdfUrl;
    
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

  if (error || !pdfUrl) {
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

  // Interface minimaliste avec seulement des boutons d'action
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 p-4 flex justify-center items-center flex-grow rounded-lg border border-gray-200">
        <div className="text-center max-w-md">
          <h3 className="font-medium text-lg mb-2">Document PDF disponible</h3>
          <p className="text-gray-600 mb-6">
            Pour une meilleure expérience et éviter les problèmes d'affichage, 
            veuillez utiliser l'une des options ci-dessous pour consulter votre document.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={openInNewTab}
              className="w-full flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Ouvrir dans un nouvel onglet
            </Button>
            
            <Button 
              onClick={downloadPdf}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Télécharger le PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
