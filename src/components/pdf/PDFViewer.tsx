
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, FileText } from "lucide-react";
import { printPDF } from "./utils/PrintUtils";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    if (!pdfUrl) {
      setIsLoading(false);
      return;
    }
    
    // Simple validation check for the PDF URL
    if (!pdfUrl.startsWith('data:application/pdf') && !pdfUrl.startsWith('blob:') && !pdfUrl.startsWith('http')) {
      console.error("Invalid PDF URL format:", pdfUrl.substring(0, 50) + "...");
      setHasError(true);
    }
    
    setIsLoading(false);
  }, [pdfUrl]);

  // Function to open the PDF in a new tab
  const openInNewTab = () => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible à afficher",
        variant: "destructive",
      });
      return;
    }
    
    window.open(pdfUrl, '_blank');
  };

  // Function to download the PDF
  const downloadPdf = () => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible à télécharger",
        variant: "destructive",
      });
      return;
    }
    
    // Use the same method as in PDFGenerationUtils
    const link = document.createElement('a');
    link.href = pdfUrl;
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
      <div className="flex-grow relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-8">
        <FileText size={64} className="text-gray-400 mb-4" />
        <p className="text-gray-700 text-lg font-medium mb-2">Document PDF disponible</p>
        <p className="text-gray-500 mb-6 text-center">
          Pour des raisons de compatibilité, le document ne peut pas être affiché directement dans l'application.<br/>
          Veuillez utiliser les options ci-dessous pour consulter le document.
        </p>
        
        <div className="space-y-4 w-full max-w-md">
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
  );
};
