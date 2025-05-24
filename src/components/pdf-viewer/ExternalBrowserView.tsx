
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, RefreshCw, Globe } from "lucide-react";
import { Document } from "@/types/documents";

interface ExternalBrowserViewProps {
  documentId: string;
  document: Document | null;
  error: string | null;
  retryCount: number;
  onRetry: () => void;
  onDownload: (filePath: string, fileName: string) => void;
}

const ExternalBrowserView: React.FC<ExternalBrowserViewProps> = ({
  documentId,
  document,
  error,
  retryCount,
  onRetry,
  onDownload
}) => {
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
          <CardContent className="text-center space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium text-lg">
                📄 Votre document est prêt
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Utilisez le QR code ou le bouton ci-dessous pour ouvrir votre document dans DirectivePlus.
              </p>
            </div>
            
            {/* QR Code pour accès rapide */}
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-sm text-gray-600 mb-3 font-medium">📱 Scannez avec votre téléphone :</p>
              <img 
                src={qrCodeUrl} 
                alt="QR Code pour accès direct au document"
                className="mx-auto rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  console.error('Erreur chargement QR Code');
                }}
              />
              <p className="text-xs text-gray-500 mt-2">
                Ouverture directe dans l'application
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.open(appUrl, '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Ouvrir mon document
              </Button>
              
              <p className="text-xs text-gray-600">
                Le document s'ouvrira dans une nouvelle fenêtre avec l'application DirectivePlus
              </p>
              
              {document && (
                <Button 
                  variant="outline"
                  onClick={() => onDownload(document.file_path, document.file_name)}
                  className="w-full"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger en cas de problème
                </Button>
              )}
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  ⚠️ {error}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onRetry}
                  className="mt-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            )}
            
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ <strong>Accès double :</strong> QR code pour mobile ou bouton direct pour ordinateur.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExternalBrowserView;
