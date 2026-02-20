
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Download, Globe } from "lucide-react";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { getPdfUrlWithRetry } from "@/utils/pdfUrlBuilder";
import PdfViewerHeader from "./PdfViewerHeader";
import MobileAlert from "./MobileAlert";
import PdfLoadingOverlay from "./PdfLoadingOverlay";
import PdfErrorOverlay from "./PdfErrorOverlay";
import PdfInstructions from "./PdfInstructions";
import ChromeBlockedFallback from "./ChromeBlockedFallback";
import { useState as useStateHook, useEffect } from "react";

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
    setTimeout(() => {
      const iframe = window.document.querySelector(`iframe[title="${document.file_name}"]`) as HTMLIFrameElement;
      if (iframe) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc || iframeDoc.title.includes('blocked') || iframeDoc.body?.innerText.includes('bloquée')) {
            setIsChromeBlocked(true);
            setPdfLoading(false);
            return;
          }
        } catch (error) {
          setIsChromeBlocked(true);
          setPdfLoading(false);
          return;
        }
      }
      
      setPdfLoading(false);
      setPdfError(false);
      setIsChromeBlocked(false);
    }, isMobileOrTablet ? 3000 : 2000);
  }, [document.file_name, isMobileOrTablet]);

  const handleIframeError = useCallback(() => {
    console.error("Erreur lors du chargement du PDF");
    setPdfLoading(false);
    setPdfError(true);
    setIsChromeBlocked(false);
    
    setTimeout(() => {
      setShowAlternativeOptions(true);
    }, 1000);
  }, []);

  const handleRetry = useCallback(() => {
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

        {(showAlternativeOptions || isMobileOrTablet) && (
          <div className="mb-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-4 text-center">
              Choisissez votre option préférée
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Button
                onClick={handleOpenInNewTab}
                className="bg-blue-600 hover:bg-blue-700 h-16 text-left"
                size="lg"
              >
                <ExternalLink className="w-6 h-6 mr-3" />
                <div>
                  <div className="font-semibold">Ouvrir dans le navigateur</div>
                  <div className="text-sm opacity-90">Lecture en ligne directe</div>
                </div>
              </Button>
              
              <Button
                onClick={handleDirectDownload}
                className="bg-green-600 hover:bg-green-700 h-16 text-left"
                size="lg"
              >
                <Download className="w-6 h-6 mr-3" />
                <div>
                  <div className="font-semibold">Télécharger</div>
                  <div className="text-sm opacity-90">Sauvegarder le fichier</div>
                </div>
              </Button>
            </div>

            <div className="pt-3 border-t border-blue-200">
              <p className="text-sm text-blue-700 mb-2">Option alternative :</p>
              <Button
                onClick={handleOpenWithGoogleDocs}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-300 hover:bg-purple-50"
              >
                <Globe className="w-4 h-4 mr-2" />
                Google Docs Viewer
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
