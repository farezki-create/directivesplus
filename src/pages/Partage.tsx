
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
        console.log("=== CHARGEMENT DOCUMENT PARTAGÉ (MODE SANS SÉCURITÉ) ===");
        console.log("Code de partage:", shareCode);

        // Requête ultra-simplifiée - on accepte TOUT document avec ce code
        const { data, error } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('access_code', shareCode);

        console.log("Résultat brut de la requête:", { data, error });

        if (error) {
          console.error("Erreur Supabase:", error);
          // Même en cas d'erreur, on continue pour voir ce qu'on peut récupérer
        }

        if (!data || data.length === 0) {
          console.log("Aucun document trouvé - tentative avec tous les documents");
          
          // Dernière tentative - chercher TOUS les documents partagés pour debug
          const { data: allDocs, error: allError } = await supabase
            .from('shared_documents')
            .select('*');
            
          console.log("Tous les documents partagés:", { allDocs, allError });
          
          setError(`Document introuvable avec le code: ${shareCode}`);
          return;
        }

        // Prendre le premier document trouvé (peu importe son statut)
        const documentData = data[0];
        console.log("Document trouvé:", documentData);

        // Pas de vérification d'expiration - on affiche le document
        const transformedDocument: SharedDocument = {
          document_id: documentData.document_id,
          document_type: documentData.document_type,
          document_data: documentData.document_data as SharedDocument['document_data'],
          user_id: documentData.user_id,
          shared_at: documentData.shared_at
        };

        console.log("Document transformé:", transformedDocument);
        setSharedDocument(transformedDocument);
        
        toast({
          title: "Document trouvé",
          description: "Accès autorisé au document partagé",
        });

      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(`Erreur technique: ${err}`);
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
              Debug - Document non trouvé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              Code recherché: <strong>{shareCode}</strong>
            </p>
            <p className="text-xs text-gray-400">
              Mode debug actif - toutes les sécurités sont désactivées.
              Vérifiez les logs de la console pour plus de détails.
            </p>
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
          <p className="text-gray-600">Accès direct au document (mode sans sécurité)</p>
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

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-900 mb-2">⚠️ Mode Debug</h3>
              <p className="text-sm text-yellow-800">
                Toutes les vérifications de sécurité ont été désactivées pour ce test.
                Le document est accessible sans restrictions.
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
