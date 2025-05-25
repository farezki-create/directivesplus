
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
  const appUrl = `https://24c30559-a746-463d-805e-d2330d3a13f4.lovableproject.com/pdf/${documentId}`;
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
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                ✅ Accès direct au document
              </p>
              <p className="text-sm text-green-700 mt-1">
                Ce lien fonctionne maintenant dans tous les navigateurs et applications.
              </p>
            </div>
            
            {/* QR Code pour accès direct */}
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-sm text-gray-600 mb-3">QR Code universel :</p>
              <img 
                src={qrCodeUrl} 
                alt="QR Code pour accès direct"
                className="mx-auto rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-xs text-gray-500 mt-2">
                Fonctionne dans l'app et le navigateur
              </p>
            </div>
            
            <div className="space-y-3">
              {/* Si on a le file_path direct, l'utiliser pour l'ouverture */}
              {document?.file_path && !document.file_path.startsWith('data:') ? (
                <Button 
                  onClick={() => window.open(document.file_path, '_blank')}
                  className="w-full"
                  size="lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir le PDF directement
                </Button>
              ) : (
                <Button 
                  onClick={() => window.location.href = appUrl}
                  className="w-full"
                  size="lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir dans DirectivePlus
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => {
                  const linkToCopy = document?.file_path && !document.file_path.startsWith('data:') 
                    ? document.file_path 
                    : appUrl;
                  navigator.clipboard.writeText(linkToCopy);
                  alert('Lien copié ! Collez-le dans votre navigateur.');
                }}
                className="w-full"
                size="lg"
              >
                📋 Copier le lien direct
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
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                🔗 <strong>Liens universels :</strong> Fonctionnent maintenant dans tous les contextes - QR code, navigateur, et application.
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
