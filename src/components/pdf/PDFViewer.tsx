
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { usePDFUrl } from "./hooks/usePDFUrl";
import { PDFErrorHandler } from "./PDFErrorHandler";
import { PDFLoadingIndicator } from "./PDFLoadingIndicator";
import { PDFRenderer } from "./PDFRenderer";
import { toast } from "@/hooks/use-toast";

interface PDFViewerProps {
  pdfUrl: string | null;
  onLoadError?: () => void;
  onLoadSuccess?: () => void;
}

export function PDFViewer({ pdfUrl, onLoadError, onLoadSuccess }: PDFViewerProps) {
  const isMobile = useIsMobile();
  const { cleanUrl, loadError, setLoadError } = usePDFUrl(pdfUrl);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [renderMethod, setRenderMethod] = useState<'iframe' | 'object' | 'embed'>('iframe');
  const [renderAttempts, setRenderAttempts] = useState(0);
  
  // Reset state when URL changes
  useEffect(() => {
    if (pdfUrl) {
      console.log("[PDFViewer] New PDF URL provided, resetting state");
      setIsLoading(true);
      setLoadError(false);
      setRetryCount(0);
      setRenderMethod('iframe');
      setRenderAttempts(0);
    }
  }, [pdfUrl, setLoadError]);
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    console.log("[PDFViewer] PDF content loaded successfully with method:", renderMethod);
    setLoadError(false);
    setIsLoading(false);
    if (onLoadSuccess) onLoadSuccess();
  };
  
  const handleIframeError = () => {
    console.error(`[PDFViewer] Failed to load PDF with method: ${renderMethod}`);
    setRenderAttempts(prev => prev + 1);
    
    // Try another rendering method if current one fails
    if (renderMethod === 'iframe' && renderAttempts < 1) {
      console.log("[PDFViewer] Switching to object tag rendering");
      setRenderMethod('object');
      setRetryCount(prev => prev + 1);
      toast({
        title: "Changement de méthode d'affichage",
        description: "Essai d'une méthode alternative d'affichage du PDF...",
      });
      return;
    } else if (renderMethod === 'object' && renderAttempts < 2) {
      console.log("[PDFViewer] Switching to embed tag rendering");
      setRenderMethod('embed');
      setRetryCount(prev => prev + 1);
      toast({
        title: "Dernière tentative",
        description: "Essai de la dernière méthode d'affichage du PDF...",
      });
      return;
    }
    
    // If all methods fail, show error
    setLoadError(true);
    setIsLoading(false);
    if (onLoadError) onLoadError();
    
    toast({
      title: "Erreur d'affichage",
      description: "Impossible d'afficher le PDF. Essayez de le télécharger directement.",
      variant: "destructive",
    });
  };

  // Setup a timeout to detect loading issues
  useEffect(() => {
    if (!cleanUrl || !isLoading) return;
    
    const timeoutId = setTimeout(() => {
      // If still loading after timeout, consider it an error
      if (isLoading) {
        console.log("[PDFViewer] PDF load timeout reached");
        
        // Try next render method on timeout
        if (renderMethod === 'iframe' && renderAttempts < 1) {
          console.log("[PDFViewer] Timeout - switching to object tag");
          setRenderMethod('object');
          setRetryCount(prev => prev + 1);
          setRenderAttempts(prev => prev + 1);
          toast({
            title: "Chargement lent",
            description: "Essai d'une méthode alternative d'affichage...",
          });
          return;
        } else if (renderMethod === 'object' && renderAttempts < 2) {
          console.log("[PDFViewer] Timeout - switching to embed tag");
          setRenderMethod('embed');
          setRetryCount(prev => prev + 1);
          setRenderAttempts(prev => prev + 1);
          toast({
            title: "Chargement lent",
            description: "Dernière tentative d'affichage...",
          });
          return;
        }
        
        setLoadError(true);
        setIsLoading(false);
        if (onLoadError) onLoadError();
        
        toast({
          title: "Timeout",
          description: "Le chargement du PDF a pris trop de temps. Essayez de le télécharger directement.",
          variant: "destructive",
        });
      }
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [cleanUrl, isLoading, onLoadError, renderMethod, renderAttempts, setLoadError]);

  // Reset loading state when render method changes
  useEffect(() => {
    if (cleanUrl) {
      setIsLoading(true);
    }
  }, [renderMethod, cleanUrl]);

  // Error handling functions
  const handleRetry = () => {
    console.log("[PDFViewer] Retrying PDF load");
    setRetryCount(0);
    setRenderMethod('iframe');
    setRenderAttempts(0);
    setLoadError(false);
    setIsLoading(true);
    
    toast({
      title: "Nouvelle tentative",
      description: "Tentative de rechargement du PDF...",
    });
  };

  const handleDirectDownload = () => {
    if (cleanUrl) {
      console.log("[PDFViewer] Direct download initiated");
      const link = document.createElement('a');
      link.href = cleanUrl;
      link.download = 'directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement",
        description: "Le PDF a été téléchargé.",
      });
    }
  };

  const openInNewTab = () => {
    if (cleanUrl) {
      console.log("[PDFViewer] Opening PDF in new tab");
      window.open(cleanUrl, '_blank');
      
      toast({
        title: "Nouvel onglet",
        description: "Le PDF a été ouvert dans un nouvel onglet.",
      });
    }
  };

  return (
    <div className={`relative w-full h-full ${isMobile ? 'min-h-[60vh]' : 'min-h-[75vh]'} border rounded overflow-hidden`}>
      <PDFLoadingIndicator isLoading={isLoading} />
      
      <PDFErrorHandler 
        isVisible={loadError}
        onRetry={handleRetry}
        onDirectDownload={handleDirectDownload}
        onOpenInNewTab={openInNewTab}
      />
      
      <PDFRenderer 
        url={cleanUrl}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        retryCount={retryCount}
        renderMethod={renderMethod}
      />
    </div>
  );
}
