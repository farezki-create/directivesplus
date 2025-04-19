
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Printer } from "lucide-react";

interface PDFActionButtonsProps {
  onOpenInNewTab: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

export const PDFActionButtons = ({
  onOpenInNewTab,
  onDownload,
  onPrint
}: PDFActionButtonsProps) => {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-3">
      <Button 
        onClick={onOpenInNewTab}
        className="flex items-center justify-center gap-2"
      >
        <ExternalLink size={16} />
        Ouvrir dans un nouvel onglet
      </Button>
      
      <Button 
        onClick={onDownload}
        variant="outline"
        className="flex items-center justify-center gap-2"
      >
        <Download size={16} />
        Télécharger
      </Button>
      
      <Button
        onClick={onPrint}
        variant="secondary"
        className="flex items-center justify-center gap-2"
      >
        <Printer size={16} />
        Imprimer
      </Button>
    </div>
  );
};
