
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink, ArrowLeft, Smartphone } from "lucide-react";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  content_type?: string;
  user_id: string;
  created_at: string;
}

interface PdfViewerHeaderProps {
  document: Document;
  isMobile: boolean;
  pdfLoading: boolean;
  onGoBack: () => void;
  onDirectDownload: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onOpenExternal: () => void;
}

const PdfViewerHeader: React.FC<PdfViewerHeaderProps> = ({
  document,
  isMobile,
  pdfLoading,
  onGoBack,
  onDirectDownload,
  onDownload,
  onPrint,
  onOpenExternal
}) => {
  return (
    <div className="bg-white border-b p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-lg font-semibold">{document.file_name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button onClick={onDirectDownload} className="bg-green-600 hover:bg-green-700">
              <Smartphone className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          )}
          <Button variant="outline" onClick={onDownload} disabled={pdfLoading}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="outline" onClick={onPrint} disabled={pdfLoading}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" onClick={onOpenExternal} disabled={pdfLoading}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Ouvrir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfViewerHeader;
