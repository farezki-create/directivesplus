
import React from "react";
import { Button } from "@/components/ui/button";

interface PdfErrorOverlayProps {
  retryCount: number;
  onRetry: () => void;
  onOpenExternal: () => void;
}

const PdfErrorOverlay: React.FC<PdfErrorOverlayProps> = ({ 
  retryCount, 
  onRetry, 
  onOpenExternal 
}) => {
  return (
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
          <Button onClick={onRetry} variant="outline">
            Réessayer
          </Button>
          <Button onClick={onOpenExternal} variant="default">
            Ouvrir dans un nouvel onglet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfErrorOverlay;
