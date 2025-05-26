
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink, ArrowLeft } from "lucide-react";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  content_type?: string;
  user_id: string;
  created_at: string;
}

interface PdfViewerContentProps {
  document: Document;
  onDownload: () => void;
  onGoBack: () => void;
}

const PdfViewerContent: React.FC<PdfViewerContentProps> = ({
  document,
  onDownload,
  onGoBack
}) => {
  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Document non trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Le document demandé n'a pas pu être trouvé.
            </p>
            <Button onClick={onGoBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleOpenExternal = () => {
    if (document.file_path) {
      window.open(document.file_path, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec actions */}
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
            <Button variant="outline" onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="outline" onClick={handleOpenExternal}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Ouvrir
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu du PDF */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow">
          {document.file_path.startsWith('data:') ? (
            // PDF en data URL
            <iframe
              src={document.file_path}
              className="w-full h-[80vh]"
              title={document.file_name}
            />
          ) : (
            // PDF par URL
            <iframe
              src={document.file_path}
              className="w-full h-[80vh]"
              title={document.file_name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewerContent;
