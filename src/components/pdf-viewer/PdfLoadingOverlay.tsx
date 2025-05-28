
import React from "react";
import { Loader2 } from "lucide-react";

interface PdfLoadingOverlayProps {
  retryCount: number;
}

const PdfLoadingOverlay: React.FC<PdfLoadingOverlayProps> = ({ retryCount }) => {
  return (
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
  );
};

export default PdfLoadingOverlay;
