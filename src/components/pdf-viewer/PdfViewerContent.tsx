import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink, ArrowLeft, Loader2, Smartphone } from "lucide-react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Détecter si c'est un appareil mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || window.innerWidth <= 768;
    };
    
    setIsMobile(checkMobile());
  }, []);

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

  const handlePrint = () => {
    window.print();
  };

  const handleOpenExternal = () => {
    if (document.file_path) {
      window.open(document.file_path, '_blank');
    }
  };

  // Construire l'URL du PDF avec paramètres optimisés pour affichage complet
  const getPdfViewerUrl = (filePath: string) => {
    if (filePath.startsWith('data:')) {
      return filePath;
    }
    
    // Paramètres PDF pour affichage complet et navigation
    const pdfParams = new URLSearchParams({
      'toolbar': '1',
      'navpanes': '1',
      'scrollbar': '1',
      'view': 'FitV',
      'zoom': 'page-width',
      'pagemode': 'thumbs',
      'search': '',
      'nameddest': '',
      'page': '1'
    });
    
    return `${filePath}#${pdfParams.toString()}`;
  };

  // URL avec retry counter pour forcer le rechargement
  const getPdfUrlWithRetry = (filePath: string) => {
    const baseUrl = getPdfViewerUrl(filePath);
    return retryCount > 0 ? `${baseUrl}&retry=${retryCount}` : baseUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec actions */}
      <div className="bg-white border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-lg font-semibold">{document.file_name}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button onClick={handleDirectDownload} className="bg-green-600 hover:bg-green-700">
                <Smartphone className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            )}
            <Button variant="outline" onClick={onDownload} disabled={pdfLoading}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline" onClick={handlePrint} disabled={pdfLoading}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="outline" onClick={handleOpenExternal} disabled={pdfLoading}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Ouvrir
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu du PDF */}
      <div className="container mx-auto p-4">
        {/* Alerte spéciale mobile */}
        {isMobile && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">Mode Mobile Détecté</h3>
                <p className="text-sm text-green-700 mt-1">
                  Pour une meilleure expérience, utilisez le bouton "Télécharger" vert ci-dessus pour ouvrir le PDF dans votre application de lecture par défaut.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow relative">
          {/* État de chargement */}
          {pdfLoading && (
            <div className="absolute inset-0 bg-white rounded-lg flex flex-col items-center justify-center z-10">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-directiveplus-600 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Chargement de vos directives anticipées
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    Nous préparons l'affichage complet de votre document. 
                    Toutes les pages seront accessibles dans quelques instants...
                  </p>
                  {retryCount > 0 && (
                    <p className="text-xs text-orange-600">
                      Tentative {retryCount + 1} de chargement en cours...
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="h-2 w-2 bg-directiveplus-600 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-directiveplus-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 bg-directiveplus-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* État d'erreur */}
          {pdfError && (
            <div className="absolute inset-0 bg-white rounded-lg flex flex-col items-center justify-center z-10">
              <div className="text-center space-y-4">
                <div className="text-red-500 text-4xl">⚠️</div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Erreur de chargement
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    Le document n'a pas pu être chargé. Veuillez réessayer ou utiliser le bouton "Ouvrir" ci-dessus.
                  </p>
                  {retryCount < 3 && (
                    <p className="text-xs text-blue-600">
                      Nouvelle tentative automatique dans quelques secondes...
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRetry} variant="outline">
                    Réessayer
                  </Button>
                  <Button onClick={handleOpenExternal} variant="default">
                    Ouvrir dans un nouvel onglet
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PDF iframe avec paramètres optimisés */}
          <iframe
            key={`pdf-${document.id}-${retryCount}`} // Force reload on retry
            src={getPdfUrlWithRetry(document.file_path)}
            className="w-full h-[90vh] border-0 rounded-lg"
            title={document.file_name}
            style={{ minHeight: '900px' }}
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-forms allow-downloads"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>

        {/* Instructions pour la navigation */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            📄 <strong>Navigation :</strong> Utilisez la barre d'outils du PDF pour naviguer entre les pages, zoomer, ou rechercher du contenu dans le document.
          </p>
          <p className="text-xs text-blue-600 mt-1">
            💡 <strong>Astuce :</strong> Si le document semble incomplet, attendez quelques secondes que toutes les pages se chargent, ou utilisez le bouton "Ouvrir" pour l'afficher dans un nouvel onglet.
          </p>
          {isMobile && (
            <p className="text-xs text-green-600 mt-1">
              📱 <strong>Sur mobile :</strong> Utilisez le bouton vert "Télécharger" en haut pour une meilleure expérience sur téléphone.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewerContent;
