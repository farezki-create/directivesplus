import React, { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink, ArrowLeft, AlertCircle, RefreshCw, Globe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { useDocumentPrint } from "@/hooks/useDocumentPrint";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";

const PdfViewer = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('id');
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExternalBrowser, setIsExternalBrowser] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();

  // Détection améliorée du navigateur externe
  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const hasInAppParam = window.location.search.includes('inapp=true');
      
      // Détection plus précise
      const isLovableApp = hostname === 'localhost' || 
                          hostname.includes('lovableproject.com') ||
                          protocol === 'capacitor:' ||
                          (window as any).ReactNativeWebView ||
                          hasInAppParam;
      
      // Détection des navigateurs mobiles courants
      const isMobileBrowser = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isDesktopBrowser = !isMobileBrowser && (
        userAgent.includes('chrome') || 
        userAgent.includes('firefox') || 
        userAgent.includes('safari') || 
        userAgent.includes('edge')
      );
      
      console.log('Browser detection enhanced:', { 
        hostname, 
        protocol,
        hasInAppParam,
        isMobileBrowser,
        isDesktopBrowser,
        userAgent,
        isLovableApp 
      });
      
      setIsExternalBrowser(!isLovableApp && (isMobileBrowser || isDesktopBrowser));
    };
    
    detectBrowser();
  }, []);

  // Chargement du document avec plusieurs tentatives
  useEffect(() => {
    const loadDocumentWithRetry = async (attempt = 0) => {
      if (!documentId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Tentative ${attempt + 1} de chargement du document:`, documentId);
        
        // Tentative 1: pdf_documents
        let { data, error } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .single();

        console.log('Résultat pdf_documents:', { data, error });

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (!data) {
          // Tentative 2: directives
          const { data: directiveData, error: directiveError } = await supabase
            .from('directives')
            .select('*')
            .eq('id', documentId)
            .single();

          console.log('Résultat directives:', { directiveData, directiveError });

          if (directiveError && directiveError.code !== 'PGRST116') {
            throw directiveError;
          }

          if (!directiveData) {
            // Tentative 3: shared_documents
            const { data: sharedData, error: sharedError } = await supabase
              .from('shared_documents')
              .select('*')
              .eq('document_id', documentId)
              .single();

            console.log('Résultat shared_documents:', { sharedData, sharedError });

            if (sharedError && sharedError.code !== 'PGRST116') {
              throw sharedError;
            }

            if (!sharedData) {
              throw new Error(`Document introuvable avec l'ID: ${documentId}`);
            }

            // Document trouvé dans shared_documents
            setDocument({
              id: sharedData.document_id,
              file_name: `Document partagé`,
              file_path: sharedData.document_data?.file_path || '#',
              file_type: sharedData.document_type || 'application/pdf',
              content_type: sharedData.document_type,
              user_id: sharedData.user_id,
              created_at: sharedData.shared_at,
              description: 'Document partagé'
            });
          } else {
            // Document trouvé dans directives
            const content = directiveData.content as any;
            setDocument({
              id: directiveData.id,
              file_name: content?.title || content?.titre || 'Directive anticipée',
              file_path: `data:application/pdf;base64,${btoa('PDF directive')}`, // Placeholder
              file_type: 'application/json',
              content_type: 'application/json',
              user_id: directiveData.user_id,
              created_at: directiveData.created_at,
              description: 'Directive anticipée',
              content: directiveData.content
            });
          }
        } else {
          // Document trouvé dans pdf_documents
          setDocument({
            id: data.id,
            file_name: data.file_name,
            file_path: data.file_path,
            file_type: data.content_type || 'application/pdf',
            content_type: data.content_type,
            user_id: data.user_id,
            created_at: data.created_at,
            description: data.description,
            file_size: data.file_size,
            updated_at: data.updated_at,
            external_id: data.external_id
          });
        }

        console.log("Document chargé avec succès");

      } catch (err: any) {
        console.error(`Erreur tentative ${attempt + 1}:`, err);
        
        if (attempt < 2) {
          // Retry après 1 seconde
          setTimeout(() => {
            setRetryCount(attempt + 1);
            loadDocumentWithRetry(attempt + 1);
          }, 1000 * (attempt + 1));
          return;
        }
        
        setError(err.message || 'Impossible de charger le document');
      } finally {
        setLoading(false);
      }
    };

    loadDocumentWithRetry();
  }, [documentId, retryCount]);

  // Solutions pour navigateur externe
  if (isExternalBrowser) {
    const appUrl = `https://24c30559-a746-463d-805e-d2330d3a13f4.lovableproject.com/pdf-viewer?id=${documentId}&inapp=true`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`;
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Globe className="h-6 w-6 text-blue-600" />
                Document Médical
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">
                  📱 Accès optimisé disponible
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Pour une meilleure expérience de visualisation, utilisez l'application DirectivePlus.
                </p>
              </div>
              
              {/* QR Code pour accès rapide */}
              <div className="p-4 bg-white rounded-lg border">
                <p className="text-sm text-gray-600 mb-3">Scannez pour ouvrir dans l'app :</p>
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code pour accès direct"
                  className="mx-auto rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = appUrl}
                  className="w-full"
                  size="lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir dans DirectivePlus
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(appUrl);
                    alert('Lien copié ! Collez-le dans votre navigateur.');
                  }}
                  className="w-full"
                  size="lg"
                >
                  📋 Copier le lien
                </Button>
                
                {document && (
                  <Button 
                    variant="outline"
                    onClick={() => handleDownload(document.file_path, document.file_name)}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger directement
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={() => window.open(`https://docs.google.com/gview?url=${encodeURIComponent(document?.file_path || '')}&embedded=true`, '_blank')}
                  className="w-full"
                  size="lg"
                  disabled={!document?.file_path || document.file_path === '#'}
                >
                  👁️ Aperçu Google Docs
                </Button>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  💡 <strong>Solutions multiples :</strong> QR code, lien direct, téléchargement, ou aperçu en ligne.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    ⚠️ {error}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setRetryCount(prev => prev + 1);
                      setError(null);
                    }}
                    className="mt-2"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!documentId) {
    return <Navigate to="/mes-directives" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">
                Chargement du document... 
                {retryCount > 0 && ` (Tentative ${retryCount + 1})`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Document non trouvé'}
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-x-2">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setRetryCount(prev => prev + 1);
                setError(null);
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    handleDownload(document.file_path, document.file_name);
  };

  const handlePrintPdf = () => {
    handlePrint(document.file_path, document.content_type);
  };

  const handleOpenExternal = () => {
    window.open(document.file_path, '_blank');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGoBack}
                  className="mr-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                Visualisation PDF - {document.file_name}
              </CardTitle>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadPdf}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrintPdf}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenExternal}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-white">
              <object 
                data={document.file_path}
                type="application/pdf"
                className="w-full h-[80vh]"
                title={document.file_name}
              >
                <div className="p-8 text-center">
                  <p className="text-gray-600 mb-4">
                    Votre navigateur ne peut pas afficher ce PDF directement.
                  </p>
                  <div className="space-y-2">
                    <Button onClick={handleDownloadPdf} className="mr-2">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button variant="outline" onClick={handleOpenExternal}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ouvrir dans un nouvel onglet
                    </Button>
                  </div>
                </div>
              </object>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Accès direct via QR code :</strong> Ce document est accessible directement 
                sans code d'accès pour une consultation rapide.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PdfViewer;
