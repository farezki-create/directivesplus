
import React from 'react';
import { Button } from "@/components/ui/button";
import { Image, X } from "lucide-react";

interface PdfImageDisplayProps {
  capturedImage: string | null;
  isCapturing: boolean;
  onCapture: () => void;
  onClear: () => void;
  documentName: string;
}

const PdfImageDisplay: React.FC<PdfImageDisplayProps> = ({
  capturedImage,
  isCapturing,
  onCapture,
  onClear,
  documentName
}) => {
  return (
    <div className="bg-white rounded-md border p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">
          {capturedImage ? "Copie photo du document" : "Créer une copie photo"}
        </h4>
        <div className="flex gap-2">
          {!capturedImage && (
            <Button
              size="sm"
              onClick={onCapture}
              disabled={isCapturing}
              className="flex items-center gap-1 text-xs"
            >
              <Image className="h-3 w-3" />
              {isCapturing ? "Capture..." : "Créer copie photo"}
            </Button>
          )}
          {capturedImage && (
            <Button
              size="sm"
              variant="outline"
              onClick={onClear}
              className="flex items-center gap-1 text-xs"
            >
              <X className="h-3 w-3" />
              Supprimer
            </Button>
          )}
        </div>
      </div>
      
      {isCapturing && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Création de la copie photo en cours...</p>
        </div>
      )}
      
      {capturedImage ? (
        <div className="border rounded bg-gray-50 p-2">
          <img 
            src={capturedImage} 
            alt={`Copie photo de ${documentName}`}
            className="w-full max-w-lg mx-auto shadow-lg rounded"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
          <p className="text-xs text-gray-500 text-center mt-2">
            Copie photo de {documentName}
          </p>
        </div>
      ) : !isCapturing && (
        <div className="text-sm text-gray-500 italic p-3 border rounded bg-gray-50 text-center">
          <p className="mb-2">Aucune copie photo créée.</p>
          <p className="text-xs">Cliquez sur "Créer copie photo" pour capturer le document en tant qu'image.</p>
        </div>
      )}
    </div>
  );
};

export default PdfImageDisplay;
