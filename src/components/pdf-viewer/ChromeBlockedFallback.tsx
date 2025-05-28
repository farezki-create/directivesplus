
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Eye, AlertTriangle, Globe } from "lucide-react";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  content_type?: string;
  user_id: string;
  created_at: string;
}

interface ChromeBlockedFallbackProps {
  document: Document;
  onDownload: () => void;
  onOpenExternal: () => void;
  onUseBrowserViewer: () => void;
}

const ChromeBlockedFallback: React.FC<ChromeBlockedFallbackProps> = ({
  document,
  onDownload,
  onOpenExternal,
  onUseBrowserViewer
}) => {
  const handleOpenWithGoogleDocs = () => {
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(document.file_path)}`;
    window.open(googleDocsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="absolute inset-0 bg-white rounded-lg flex flex-col items-center justify-center z-10 p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-orange-500 text-5xl">
          <AlertTriangle className="h-16 w-16 mx-auto" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            Affichage bloqué par le navigateur
          </h3>
          <p className="text-gray-600">
            Le navigateur a bloqué l'affichage de ce PDF pour des raisons de sécurité. 
            Choisissez votre option préférée ci-dessous :
          </p>
        </div>

        <div className="space-y-4">
          {/* Options principales : Navigateur ou Téléchargement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={onUseBrowserViewer} 
              className="w-full bg-blue-600 hover:bg-blue-700 h-14"
              size="lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Ouvrir dans le navigateur</div>
                <div className="text-xs opacity-90">Lecture en ligne</div>
              </div>
            </Button>
            
            <Button 
              onClick={onDownload} 
              className="w-full bg-green-600 hover:bg-green-700 h-14"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Télécharger</div>
                <div className="text-xs opacity-90">Sauvegarder le fichier</div>
              </div>
            </Button>
          </div>

          {/* Option alternative */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Option alternative :</p>
            <Button 
              onClick={handleOpenWithGoogleDocs} 
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Globe className="w-5 h-5 mr-2" />
              Ouvrir avec Google Docs Viewer
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>💡 Conseil :</strong> Pour éviter ce problème à l'avenir, vous pouvez autoriser 
          l'affichage des PDF dans les paramètres de votre navigateur.
        </div>
      </div>
    </div>
  );
};

export default ChromeBlockedFallback;
