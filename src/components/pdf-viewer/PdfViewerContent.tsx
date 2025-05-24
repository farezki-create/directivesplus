
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink, ArrowLeft } from "lucide-react";
import { Document } from "@/types/documents";

interface PdfViewerContentProps {
  document: Document;
  onDownload: () => void;
  onPrint: () => void;
  onOpenExternal: () => void;
  onGoBack: () => void;
}

const PdfViewerContent: React.FC<PdfViewerContentProps> = ({
  document,
  onDownload,
  onPrint,
  onOpenExternal,
  onGoBack
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onGoBack}
                  className="mr-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                Visualisation PDF - {document.file_name}
              </CardTitle>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onPrint}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onOpenExternal}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-white">
              <object 
                data={document.file_path}
                type="application/pdf"
                className="w-full h-[80vh]"
                title={document.file_name}
              >
                <div className="p-8 text-center">
                  <p className="text-gray-600 mb-4">
                    Votre navigateur ne peut pas afficher ce PDF directement.
                  </p>
                  <div className="space-y-2">
                    <Button onClick={onDownload} className="mr-2">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button variant="outline" onClick={onOpenExternal}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ouvrir dans un nouvel onglet
                    </Button>
                  </div>
                </div>
              </object>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Accès direct via QR code :</strong> Ce document est accessible directement 
                sans code d'accès pour une consultation rapide.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PdfViewerContent;
