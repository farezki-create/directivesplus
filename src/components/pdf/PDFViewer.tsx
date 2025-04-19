
import React, { useEffect, useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Printer, FileText } from "lucide-react";
import { printPDF, downloadPDF } from "./utils/PrintUtils";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Nettoyer l'URL Blob précédente pour éviter les fuites de mémoire
    if (blobUrl && blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }

    setIsLoading(true);
    setHasError(false);
    
    if (!pdfUrl) {
      setIsLoading(false);
      return;
    }

    // Convertir les data URLs en URLs Blob pour une meilleure compatibilité
    const handlePdfUrl = async () => {
      try {
        if (pdfUrl.startsWith('data:application/pdf')) {
          // Convertir data URL en Blob
          const response = await fetch(pdfUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          console.log("PDF data URL convertie en Blob URL:", url);
        } else {
          // Utiliser directement l'URL externe
          setBlobUrl(pdfUrl);
          console.log("Utilisation directe de l'URL externe:", pdfUrl);
        }
      } catch (error) {
        console.error("Erreur lors de la conversion du PDF:", error);
        setHasError(true);
        toast({
          title: "Erreur",
          description: "Impossible de préparer le document PDF pour l'affichage",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    handlePdfUrl();

    // Nettoyer à la démontage du composant
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [pdfUrl, toast, blobUrl]);

  // Fonction pour ouvrir le PDF dans un nouvel onglet
  const openInNewTab = () => {
    const urlToOpen = blobUrl || pdfUrl;
    
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

  // Fonction pour imprimer le PDF
  const handlePrint = () => {
    if (blobUrl) {
      printPDF(blobUrl);
    } else if (pdfUrl) {
      printPDF(pdfUrl);
    } else {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible à imprimer",
        variant: "destructive",
      });
    }
  };

  // Fonction pour télécharger le PDF
  const handleDownload = () => {
    if (blobUrl) {
      downloadPDF(blobUrl);
    } else if (pdfUrl) {
      downloadPDF(pdfUrl);
    } else {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible à télécharger",
        variant: "destructive",
      });
    }
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
      {!hasError && blobUrl ? (
        <div className="flex-grow relative min-h-[400px] bg-white rounded-lg overflow-hidden border border-gray-200">
          <iframe
            ref={iframeRef}
            src={blobUrl}
            className="absolute inset-0 w-full h-full"
            title="Aperçu PDF"
            onError={() => setHasError(true)}
          />
        </div>
      ) : (
        <div className="flex-grow relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-8">
          <FileText size={64} className="text-gray-400 mb-4" />
          <p className="text-gray-700 text-lg font-medium mb-2">Document PDF disponible</p>
          <p className="text-gray-500 mb-6 text-center">
            Pour des raisons de compatibilité, le document ne peut pas être affiché directement dans l'application.<br/>
            Veuillez utiliser les options ci-dessous pour consulter le document.
          </p>
        </div>
      )}
      
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button 
          onClick={openInNewTab}
          className="flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} />
          Ouvrir dans un nouvel onglet
        </Button>
        
        <Button 
          onClick={handleDownload}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <Download size={16} />
          Télécharger
        </Button>
        
        <Button
          onClick={handlePrint}
          variant="secondary"
          className="flex items-center justify-center gap-2"
        >
          <Printer size={16} />
          Imprimer
        </Button>
      </div>
    </div>
  );
};
