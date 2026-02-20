import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertCircle, FileText, Clock, User, Download, Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppNavigation from "@/components/AppNavigation";

interface DirectiveContent {
  title?: string;
  titre?: string;
  [key: string]: any;
}

export function DirectDocumentAccess() {
  const { documentId } = useParams<{ documentId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<any>(null);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) {
        setError("ID de document manquant");
        setIsLoading(false);
        return;
      }

      try {

        // Get client information for audit logging
        const clientInfo = {
          ip_address: null, // Would be populated by backend
          user_agent: navigator.userAgent,
          session_id: crypto.randomUUID()
        };

        // Use secure document access function with audit logging
        const { data: secureAccess, error: secureError } = await supabase
          .rpc('secure_document_access', {
            p_document_id: documentId,
            p_access_method: 'direct_link',
            p_ip_address: clientInfo.ip_address,
            p_user_agent: clientInfo.user_agent,
            p_session_id: clientInfo.session_id
          });

        if (secureError) {
          console.error("Secure access error:", secureError);
          
          // Log security event for failed access
          await supabase.rpc('log_security_event_enhanced', {
            p_event_type: 'document_access_denied',
            p_ip_address: clientInfo.ip_address,
            p_user_agent: clientInfo.user_agent,
            p_details: { 
              document_id: documentId, 
              error: secureError.message,
              access_method: 'direct_link'
            },
            p_risk_level: 'high',
            p_resource_id: documentId,
            p_resource_type: 'pdf_document'
          });

          throw new Error("Accès non autorisé au document");
        }

        if (!secureAccess || secureAccess.length === 0) {
          throw new Error("Document non trouvé ou accès refusé");
        }

        const accessResult = secureAccess[0];
        if (!accessResult.access_granted) {
          throw new Error("Accès refusé à ce document");
        }

        setDocument(accessResult);

        // Get owner information for display
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', accessResult.user_id)
          .single();

        setOwnerInfo(profile);

        // Log successful access
        await supabase.rpc('log_security_event_enhanced', {
          p_event_type: 'document_access_granted',
          p_ip_address: clientInfo.ip_address,
          p_user_agent: clientInfo.user_agent,
          p_details: { 
            document_id: documentId,
            access_method: 'direct_link',
            document_name: accessResult.file_name
          },
          p_risk_level: 'low',
          p_resource_id: documentId,
          p_resource_type: 'pdf_document'
        });

        

      } catch (error: any) {
        console.error("Erreur lors du chargement sécurisé:", error);
        setError(error.message || "Impossible d'accéder au document");
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  const handleSecureAction = async (action: string, handler: () => void) => {
    try {
      // Log the action
      await supabase.rpc('log_security_event_enhanced', {
        p_event_type: `document_${action}`,
        p_details: { 
          document_id: documentId,
          action: action,
          document_name: document?.file_name
        },
        p_risk_level: 'low',
        p_resource_id: documentId,
        p_resource_type: 'pdf_document'
      });

      handler();
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast({
        title: "Erreur",
        description: `Impossible d'effectuer l'action: ${action}`,
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    handleSecureAction('download', () => {
      if (document?.file_path) {
        const link = window.document.createElement('a');
        link.href = document.file_path;
        link.download = document.file_name;
        link.target = '_blank';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        
        toast({
          title: "Téléchargement commencé",
          description: `${document.file_name} est en cours de téléchargement`,
        });
      }
    });
  };

  const handleView = () => {
    handleSecureAction('view', () => {
      if (document?.file_path) {
        window.open(document.file_path, '_blank');
      }
    });
  };

  const handlePrint = () => {
    handleSecureAction('print', () => {
      if (document?.file_path) {
        const printWindow = window.open(document.file_path, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      }
    });
  };

  if (!documentId) {
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
          <p className="text-gray-600">Vérification sécurisée en cours...</p>
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
                Document non accessible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Cet accès a été refusé pour des raisons de sécurité. Tous les tentatives d'accès sont enregistrées.
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
          {/* Header avec informations */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Document Médical Sécurisé
              </h1>
            </div>
            
            {ownerInfo && (
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                <User className="h-4 w-4" />
                <span>{ownerInfo.first_name} {ownerInfo.last_name}</span>
              </div>
            )}
            
            <p className="text-gray-600">
              Accès sécurisé • {document?.file_name}
            </p>
          </div>

          {/* Enhanced security alert */}
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-900 mb-1">
                    🔒 Document médical protégé
                  </h3>
                  <p className="text-sm text-red-800">
                    Ce document est protégé par des mesures de sécurité avancées. 
                    Tous les accès sont enregistrés et surveillés en temps réel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions on document */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {document?.file_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                <Button onClick={handleView} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visualiser
                </Button>
                <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger
                </Button>
                <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimer
                </Button>
              </div>
              
              {document?.description && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{document.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced security footer */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    Accès sécurisé et surveillé
                  </h3>
                  <p className="text-sm text-blue-800">
                    Ce document est accessible via un lien sécurisé. Toutes les actions sont 
                    enregistrées avec audit trail complet pour la conformité médicale.
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
