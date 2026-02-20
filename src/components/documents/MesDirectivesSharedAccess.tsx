import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertCircle, FileText, Clock, User } from "lucide-react";
import { DocumentCardRefactored } from "./card/DocumentCardRefactored";
import AppNavigation from "@/components/AppNavigation";
import { Document } from "@/types/documents";

interface SharedDocumentData {
  file_name: string;
  file_path: string;
  content_type?: string;
  description?: string;
}

interface SupabaseSharedDocument {
  document_id: string;
  document_type: string;
  document_data: any;
  user_id: string;
  shared_at: string;
  expires_at?: string;
  is_active: boolean;
  access_code: string;
  id: string;
}

export function MesDirectivesSharedAccess() {
  const [searchParams] = useSearchParams();
  const sharedCode = searchParams.get('shared_code');
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);

  useEffect(() => {
    const loadSharedDocuments = async () => {
      if (!sharedCode) {
        setError("Code de partage manquant dans l'URL");
        setIsLoading(false);
        return;
      }

      try {
        const { data: sharedDocuments, error } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('access_code', sharedCode)
          .eq('is_active', true);

        if (error) {
          console.error("Erreur lors de la requête:", error);
          throw new Error(`Erreur de base de données: ${error.message}`);
        }

        if (!sharedDocuments || sharedDocuments.length === 0) {
          throw new Error("Aucun document trouvé avec ce code de partage");
        }

        const validDocuments = sharedDocuments.filter(doc => 
          !doc.expires_at || new Date(doc.expires_at) > new Date()
        );

        if (validDocuments.length === 0) {
          throw new Error("Ce lien de partage a expiré");
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', validDocuments[0].user_id)
          .single();

        setOwnerInfo(profile);

        const transformedDocuments: Document[] = validDocuments.map((sharedDoc: SupabaseSharedDocument) => {
          const docData = sharedDoc.document_data as SharedDocumentData;
          return {
            id: sharedDoc.document_id,
            user_id: sharedDoc.user_id,
            file_name: docData.file_name,
            file_path: docData.file_path,
            file_type: 'pdf',
            content_type: docData.content_type || 'application/pdf',
            created_at: sharedDoc.shared_at,
            description: docData.description,
            file_size: null,
            updated_at: null,
            external_id: null
          };
        });

        setDocuments(transformedDocuments);

      } catch (error: any) {
        console.error("Erreur lors du chargement:", error);
        setError(error.message || "Impossible d'accéder aux documents");
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedDocuments();
  }, [sharedCode]);

  const handleDocumentDownload = (filePath: string, fileName: string) => {
    const link = window.document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    
    toast({
      title: "Téléchargement commencé",
      description: `${fileName} est en cours de téléchargement`,
    });
  };

  const handleDocumentPrint = (filePath: string) => {
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleDocumentView = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  const handleRestrictedAction = () => {
    toast({
      title: "Action non disponible",
      description: "Seules la consultation, l'impression et le téléchargement sont autorisées",
      variant: "destructive"
    });
  };

  if (!sharedCode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNavigation hideEditingFeatures={true} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                Lien invalide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Le lien de partage semble être incomplet ou invalide.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Chargement des directives anticipées...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNavigation hideEditingFeatures={true} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                Accès impossible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  Ce lien peut avoir expiré ou être invalide. Contactez la personne qui vous a partagé ces directives pour obtenir un nouveau lien.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Directives anticipées
              </h1>
            </div>
            
            {ownerInfo && (
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                <User className="h-4 w-4" />
                <span>{ownerInfo.first_name} {ownerInfo.last_name}</span>
              </div>
            )}
            
            <p className="text-gray-600">
              Accès en consultation seulement • {documents.length} document(s) disponible(s)
            </p>
          </div>

          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-900 mb-1">
                    ⚠️ Document d'urgence médicale
                  </h3>
                  <p className="text-sm text-red-800">
                    Ces directives anticipées contiennent des informations importantes sur les volontés 
                    de la personne concernant ses soins médicaux en cas d'incapacité à s'exprimer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {documents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun document disponible</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <DocumentCardRefactored
                  key={document.id}
                  document={document}
                  onDownload={handleDocumentDownload}
                  onPrint={handleDocumentPrint}
                  onView={handleDocumentView}
                  onDelete={handleRestrictedAction}
                  showPrint={true}
                  showShare={false}
                />
              ))}
            </div>
          )}

          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    Accès temporaire
                  </h3>
                  <p className="text-sm text-blue-800">
                    Ce lien de partage est valable pendant 30 jours. Aucune identification n'est requise 
                    pour faciliter l'accès en situation d'urgence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
