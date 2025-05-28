
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { getPdfUrlWithRetry } from "@/utils/pdfUrlBuilder";
import PdfViewerHeader from "./PdfViewerHeader";
import MobileAlert from "./MobileAlert";
import PdfLoadingOverlay from "./PdfLoadingOverlay";
import PdfErrorOverlay from "./PdfErrorOverlay";
import PdfInstructions from "./PdfInstructions";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  content_type?: string;
  user_id: string;
  created_at: string;
}

interface PdfViewerContentProps {
  document: Document;
  onDownload: () => void;
  onGoBack: () => void;
}

const PdfViewerContent: React.FC<PdfViewerContentProps> = ({
  document,
  onDownload,
  onGoBack
}) => {
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { isMobile } = useMobileDetection();

  useEffect(() => {
    // Reset loading state when document changes
    setPdfLoading(true);
    setPdfError(false);
    setRetryCount(0);
  }, [document?.file_path]);

  const handleDirectDownload = () => {
    console.log("Téléchargement direct mobile pour:", document.file_name);
    
    // Créer un lien de téléchargement direct
    const link = window.document.createElement('a');
    link.href = document.file_path;
    link.download = document.file_name;
    link.target = '_blank';
    
    // Pour les appareils mobiles, on force l'ouverture
    if (isMobile) {
      link.rel = 'noopener noreferrer';
    }
    
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleIframeLoad = () => {
    console.log("PDF iframe loaded");
    
    // Délai pour permettre au PDF de se charger complètement
    setTimeout(() => {
      console.log("PDF chargé avec succès après délai");
      setPdfLoading(false);
      setPdfError(false);
    }, 2000);
  };

  const handleIframeError = () => {
    console.error("Erreur lors du chargement du PDF");
    setPdfLoading(false);
    setPdfError(true);
  };

  const handleRetry = () => {
    console.log("Retry PDF loading");
    setPdfLoading(true);
    setPdfError(false);
    setRetryCount(prev => prev + 1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenExternal = () => {
    if (document.file_path) {
      window.open(document.file_path, '_blank');
    }
  };

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Document non trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Le document demandé n'a pas pu être trouvé.
            </p>
            <Button onClick={onGoBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PdfViewerHeader
        document={document}
        isMobile={isMobile}
        pdfLoading={pdfLoading}
        onGoBack={onGoBack}
        onDirectDownload={handleDirectDownload}
        onDownload={onDownload}
        onPrint={handlePrint}
        onOpenExternal={handleOpenExternal}
      />

      <div className="container mx-auto p-4">
        {isMobile && <MobileAlert />}

        <div className="bg-white rounded-lg shadow relative">
          {pdfLoading && <PdfLoadingOverlay retryCount={retryCount} />}
          
          {pdfError && (
            <PdfErrorOverlay
              retryCount={retryCount}
              onRetry={handleRetry}
              onOpenExternal={handleOpenExternal}
            />
          )}

          <iframe
            key={`pdf-${document.id}-${retryCount}`}
            src={getPdfUrlWithRetry(document.file_path, retryCount)}
            className="w-full h-[90vh] border-0 rounded-lg"
            title={document.file_name}
            style={{ minHeight: '900px' }}
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-forms allow-downloads"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>

        <PdfInstructions isMobile={isMobile} />
      </div>
    </div>
  );
};

export default PdfViewerContent;
