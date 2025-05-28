
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { getPdfUrlWithRetry } from "@/utils/pdfUrlBuilder";
import PdfViewerHeader from "./PdfViewerHeader";
import MobileAlert from "./MobileAlert";
import PdfLoadingOverlay from "./PdfLoadingOverlay";
import PdfErrorOverlay from "./PdfErrorOverlay";
import PdfInstructions from "./PdfInstructions";
import ChromeBlockedFallback from "./ChromeBlockedFallback";

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
  const [isChromeBlocked, setIsChromeBlocked] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showAlternativeOptions, setShowAlternativeOptions] = useState(false);
  const { isMobile, isTablet, isMobileOrTablet } = useMobileDetection();

  // Reset loading state when document changes
  useEffect(() => {
    if (document?.file_path) {
      setPdfLoading(true);
      setPdfError(false);
      setIsChromeBlocked(false);
      setRetryCount(0);
      setShowAlternativeOptions(false);
    }
  }, [document?.file_path]);

  const handleDirectDownload = useCallback(() => {
    console.log("Téléchargement direct pour:", document.file_name);
    
    const link = window.document.createElement('a');
    link.href = document.file_path;
    link.download = document.file_name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  }, [document.file_name, document.file_path]);

  const handleOpenInNewTab = useCallback(() => {
    console.log("Ouverture dans un nouvel onglet:", document.file_path);
    const newWindow = window.open(document.file_path, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      setShowAlternativeOptions(true);
    }
  }, [document.file_path]);

  const handleOpenWithGoogleDocs = useCallback(() => {
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(document.file_path)}`;
    window.open(googleDocsUrl, '_blank', 'noopener,noreferrer');
  }, [document.file_path]);

  const handleIframeLoad = useCallback(() => {
    console.log("PDF iframe loaded");
    
    setTimeout(() => {
      const iframe = window.document.querySelector(`iframe[title="${document.file_name}"]`) as HTMLIFrameElement;
      if (iframe) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc || iframeDoc.title.includes('blocked') || iframeDoc.body?.innerText.includes('bloquée')) {
            console.log("Chrome a bloqué l'affichage du PDF");
            setIsChromeBlocked(true);
            setPdfLoading(false);
            return;
          }
        } catch (error) {
          console.log("Accès iframe bloqué, probablement par Chrome");
          setIsChromeBlocked(true);
          setPdfLoading(false);
          return;
        }
      }
      
      setPdfLoading(false);
      setPdfError(false);
      setIsChromeBlocked(false);
    }, isMobileOrTablet ? 3000 : 2000); // Plus de temps sur mobile/tablette
  }, [document.file_name, isMobileOrTablet]);

  const handleIframeError = useCallback(() => {
    console.error("Erreur lors du chargement du PDF");
    setPdfLoading(false);
    setPdfError(true);
    setIsChromeBlocked(false);
    
    // Afficher automatiquement les options alternatives après une erreur
    setTimeout(() => {
      setShowAlternativeOptions(true);
    }, 1000);
  }, []);

  const handleRetry = useCallback(() => {
    console.log("Retry PDF loading");
    setPdfLoading(true);
    setPdfError(false);
    setIsChromeBlocked(false);
    setShowAlternativeOptions(false);
    setRetryCount(prev => prev + 1);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleOpenExternal = useCallback(() => {
    if (document.file_path) {
      window.open(document.file_path, '_blank');
    }
  }, [document.file_path]);

  const handleUseBrowserPdfViewer = useCallback(() => {
    const cleanUrl = document.file_path.split('#')[0];
    window.open(cleanUrl, '_blank');
  }, [document.file_path]);

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
        <MobileAlert isMobile={isMobile} isTablet={isTablet} />

        {/* Options alternatives d'ouverture */}
        {(showAlternativeOptions || isMobileOrTablet) && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-800 mb-3">Options d'ouverture alternatives</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleOpenInNewTab}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Nouvel onglet
              </Button>
              <Button
                onClick={handleDirectDownload}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Télécharger
              </Button>
              <Button
                onClick={handleOpenWithGoogleDocs}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-300 hover:bg-purple-50"
              >
                Google Docs
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow relative">
          {pdfLoading && <PdfLoadingOverlay retryCount={retryCount} />}
          
          {pdfError && (
            <PdfErrorOverlay
              retryCount={retryCount}
              onRetry={handleRetry}
              onOpenExternal={handleOpenExternal}
            />
          )}

          {isChromeBlocked && (
            <ChromeBlockedFallback
              document={document}
              onDownload={onDownload}
              onOpenExternal={handleOpenExternal}
              onUseBrowserViewer={handleUseBrowserPdfViewer}
            />
          )}

          {!isChromeBlocked && (
            <iframe
              key={`pdf-${document.id}-${retryCount}`}
              src={getPdfUrlWithRetry(document.file_path, retryCount)}
              className="w-full h-[90vh] border-0 rounded-lg"
              title={document.file_name}
              style={{ minHeight: isMobileOrTablet ? '70vh' : '900px' }}
              allow="fullscreen"
              sandbox="allow-same-origin allow-scripts allow-forms allow-downloads"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </div>

        <PdfInstructions isMobile={isMobileOrTablet} />
      </div>
    </div>
  );
};

export default PdfViewerContent;
