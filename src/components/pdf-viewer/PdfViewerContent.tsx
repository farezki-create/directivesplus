
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";

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

  useEffect(() => {
    // Reset loading state when document changes
    setPdfLoading(true);
    setPdfError(false);
  }, [document?.file_path]);

  const handleIframeLoad = () => {
    console.log("PDF chargé avec succès");
    setPdfLoading(false);
    setPdfError(false);
  };

  const handleIframeError = () => {
    console.error("Erreur lors du chargement du PDF");
    setPdfLoading(false);
    setPdfError(true);
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
      'toolbar': '1',           // Afficher la barre d'outils
      'navpanes': '1',          // Afficher le panneau de navigation
      'scrollbar': '1',         // Afficher la barre de défilement
      'view': 'FitV',           // Ajustement vertical (affiche toute la largeur)
      'zoom': 'page-width',     // Zoom adapté à la largeur
      'pagemode': 'thumbs',     // Afficher les miniatures des pages
      'search': '',             // Permettre la recherche
      'nameddest': '',          // Destination nommée
      'page': '1'               // Commencer à la page 1
    });
    
    return `${filePath}#${pdfParams.toString()}`;
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
                    Toutes les pages seront accessibles...
                  </p>
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
                </div>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Réessayer
                </Button>
              </div>
            </div>
          )}

          {/* PDF iframe avec paramètres optimisés */}
          <iframe
            src={getPdfViewerUrl(document.file_path)}
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
        </div>
      </div>
    </div>
  );
};

export default PdfViewerContent;
