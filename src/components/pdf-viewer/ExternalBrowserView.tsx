
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
                  onClick={() => onDownload(document.file_path, document.file_name)}
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
                  onClick={onRetry}
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
};

export default ExternalBrowserView;
