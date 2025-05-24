
import React from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink, ArrowLeft } from "lucide-react";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { useDocumentPrint } from "@/hooks/useDocumentPrint";

const PdfViewer = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('id');
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();

  // Pour cette démonstration, nous allons simuler la récupération du PDF
  // En production, vous devriez récupérer les informations du document depuis la base de données
  const mockPdfUrl = "https://example.com/document.pdf"; // Remplacez par la vraie URL du PDF
  const mockDocumentName = "Document PDF";

  if (!documentId) {
    return <Navigate to="/mes-directives" replace />;
  }

  const handleDownloadPdf = () => {
    handleDownload(mockPdfUrl, mockDocumentName);
  };

  const handlePrintPdf = () => {
    handlePrint(mockPdfUrl, 'application/pdf');
  };

  const handleOpenExternal = () => {
    window.open(mockPdfUrl, '_blank');
  };

  const handleGoBack = () => {
    window.history.back();
  };

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
                  onClick={handleGoBack}
                  className="mr-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                Visualisation PDF - {mockDocumentName}
              </CardTitle>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadPdf}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrintPdf}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenExternal}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-white">
              <iframe 
                src={mockPdfUrl}
                className="w-full h-[80vh]"
                title={mockDocumentName}
                allow="fullscreen"
              />
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

export default PdfViewer;
