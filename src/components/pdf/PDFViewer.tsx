
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { printPDF, downloadPDF } from "./utils/PrintUtils";
import { PDFLoadingSpinner } from "./components/PDFLoadingSpinner";
import { PDFActionButtons } from "./components/PDFActionButtons";
import { PDFPreviewFallback } from "./components/PDFPreviewFallback";
import { PDFPreviewFrame } from "./components/PDFPreviewFrame";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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

    const handlePdfUrl = async () => {
      try {
        if (pdfUrl.startsWith('data:application/pdf')) {
          const response = await fetch(pdfUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          console.log("PDF data URL convertie en Blob URL:", url);
        } else {
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

    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [pdfUrl, toast, blobUrl]);

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
    return <PDFLoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-full">
      {!hasError && blobUrl ? (
        <PDFPreviewFrame 
          url={blobUrl}
          onError={() => setHasError(true)}
        />
      ) : (
        <PDFPreviewFallback />
      )}
      
      <PDFActionButtons
        onOpenInNewTab={openInNewTab}
        onDownload={handleDownload}
        onPrint={handlePrint}
      />
    </div>
  );
};
