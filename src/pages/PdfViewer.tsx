
import React, { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink, ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { useDocumentPrint } from "@/hooks/useDocumentPrint";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";

const PdfViewer = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('id');
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();

  // Charger le document depuis la base de données
  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (error) {
          console.error('Erreur lors du chargement du document:', error);
          setError('Document non trouvé');
          return;
        }

        const transformedDoc: Document = {
          id: data.id,
          file_name: data.file_name,
          file_path: data.file_path,
          file_type: data.content_type || 'application/pdf',
          content_type: data.content_type,
          user_id: data.user_id,
          created_at: data.created_at,
          description: data.description,
          file_size: data.file_size,
          updated_at: data.updated_at,
          external_id: data.external_id
        };

        setDocument(transformedDoc);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement du document');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  if (!documentId) {
    return <Navigate to="/mes-directives" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Document non trouvé'}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    handleDownload(document.file_path, document.file_name);
  };

  const handlePrintPdf = () => {
    handlePrint(document.file_path, document.content_type);
  };

  const handleOpenExternal = () => {
    window.open(document.file_path, '_blank');
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
                Visualisation PDF - {document.file_name}
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
                src={document.file_path}
                className="w-full h-[80vh]"
                title={document.file_name}
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
