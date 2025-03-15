
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, RefreshCw } from "lucide-react";

interface PDFErrorHandlerProps {
  isVisible: boolean;
  onRetry: () => void;
  onDirectDownload: () => void;
  onOpenInNewTab: () => void;
}

export function PDFErrorHandler({
  isVisible,
  onRetry,
  onDirectDownload,
  onOpenInNewTab
}: PDFErrorHandlerProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10 p-6">
      <p className="text-red-500 mb-4 text-center">
        Le PDF n'a pas pu être chargé correctement. Veuillez essayer une des options ci-dessous.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </Button>
        <Button 
          variant="outline" 
          onClick={onDirectDownload}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Télécharger
        </Button>
        <Button 
          variant="outline"
          onClick={onOpenInNewTab}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Ouvrir dans un nouvel onglet
        </Button>
      </div>
    </div>
  );
}
