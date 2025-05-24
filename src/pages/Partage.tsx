
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, FileText, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";

interface SharedDocument {
  document_id: string;
  document_type: string;
  document_data: {
    file_name: string;
    file_path: string;
    content_type?: string;
    description?: string;
  };
  user_id: string;
  shared_at: string;
}

const Partage = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [sharedDocument, setSharedDocument] = useState<SharedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedDocument = async () => {
      if (!shareCode) {
        setError("Code de partage manquant");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('access_code', shareCode)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          setError("Document non trouvé ou code de partage invalide");
          return;
        }

        // Vérifier si le document n'est pas expiré
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setError("Ce lien de partage a expiré");
          return;
        }

        // Transformer les données avec le bon typage
        const transformedDocument: SharedDocument = {
          document_id: data.document_id,
          document_type: data.document_type,
          document_data: data.document_data as SharedDocument['document_data'],
          user_id: data.user_id,
          shared_at: data.shared_at
        };

        setSharedDocument(transformedDocument);
      } catch (err) {
        console.error("Erreur lors du chargement du document partagé:", err);
        setError("Erreur lors du chargement du document");
      } finally {
        setLoading(false);
      }
    };

    loadSharedDocument();
  }, [shareCode]);

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement commencé",
        description: `${fileName} est en cours de téléchargement`,
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const handleView = (filePath: string) => {
    setPreviewDocument(filePath);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (error || !sharedDocument) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Lock size={20} />
              Accès refusé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Partagé</h1>
          <p className="text-gray-600">Accès sécurisé à un document médical</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <CardTitle className="text-xl">{sharedDocument.document_data.file_name}</CardTitle>
                {sharedDocument.document_data.description && (
                  <p className="text-sm text-gray-600 mt-1">{sharedDocument.document_data.description}</p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Partagé le {new Date(sharedDocument.shared_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={() => handleView(sharedDocument.document_data.file_path)}
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                Voir le document
              </Button>

              <Button
                variant="outline"
                onClick={() => handleDownload(sharedDocument.document_data.file_path, sharedDocument.document_data.file_name)}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Télécharger
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">⚠️ Information importante</h3>
              <p className="text-sm text-blue-800">
                Ce document médical vous a été partagé de manière sécurisée. 
                Veuillez le traiter avec la confidentialité requise pour des données de santé.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DocumentPreviewDialog 
        filePath={previewDocument} 
        onOpenChange={(open) => {
          if (!open) setPreviewDocument(null);
        }}
        onDownload={() => {
          if (previewDocument && sharedDocument) {
            handleDownload(previewDocument, sharedDocument.document_data.file_name);
          }
        }}
        onPrint={() => {
          // Impression directe depuis la preview
          if (previewDocument) {
            const printWindow = window.open(previewDocument, '_blank');
            if (printWindow) {
              printWindow.onload = () => {
                printWindow.print();
              };
            }
          }
        }}
      />
    </div>
  );
};

export default Partage;
