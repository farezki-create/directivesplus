
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
        console.log("=== ACCÈS DIRECT AU DOCUMENT ===");
        console.log("Document ID:", documentId);

        // Récupération directe du document PDF
        const { data: pdfDoc, error: pdfError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .single();

        console.log("Document PDF trouvé:", { pdfDoc, pdfError });

        if (pdfError || !pdfDoc) {
          // Essayer dans la table directives
          const { data: directiveDoc, error: directiveError } = await supabase
            .from('directives')
            .select('*')
            .eq('id', documentId)
            .single();

          console.log("Document directive trouvé:", { directiveDoc, directiveError });

          if (directiveError || !directiveDoc) {
            throw new Error("Document non trouvé");
          }

          const content = directiveDoc.content as DirectiveContent;
          setDocument({
            ...directiveDoc,
            file_name: content?.title || content?.titre || 'Directive anticipée',
            file_path: `/directive/${directiveDoc.id}`,
            content_type: 'application/json',
            isDirective: true
          });

          // Récupérer les infos du propriétaire
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', directiveDoc.user_id)
            .single();

          setOwnerInfo(profile);
        } else {
          setDocument(pdfDoc);

          // Récupérer les infos du propriétaire
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', pdfDoc.user_id)
            .single();

          setOwnerInfo(profile);
        }

        console.log("Accès direct accordé au document");

      } catch (error: any) {
        console.error("Erreur lors du chargement:", error);
        setError(error.message || "Impossible d'accéder au document");
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  const handleDownload = () => {
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
  };

  const handleView = () => {
    if (document?.file_path) {
      window.open(document.file_path, '_blank');
    }
  };

  const handlePrint = () => {
    if (document?.file_path) {
      const printWindow = window.open(document.file_path, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
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
          <p className="text-gray-600">Chargement du document...</p>
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
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  Ce document n'est peut-être plus disponible ou le lien est invalide.
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
                Document Médical
              </h1>
            </div>
            
            {ownerInfo && (
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                <User className="h-4 w-4" />
                <span>{ownerInfo.first_name} {ownerInfo.last_name}</span>
              </div>
            )}
            
            <p className="text-gray-600">
              Accès direct au document • {document?.file_name}
            </p>
          </div>

          {/* Alerte d'urgence */}
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-900 mb-1">
                    ⚠️ Document médical important
                  </h3>
                  <p className="text-sm text-red-800">
                    Ce document contient des informations médicales importantes.
                    Accès réservé aux professionnels de santé autorisés.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions sur le document */}
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

          {/* Footer informatif */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    Accès simplifié et sécurisé
                  </h3>
                  <p className="text-sm text-blue-800">
                    Ce lien permet un accès direct au document sans saisie de code.
                    Conçu pour faciliter l'accès en situation d'urgence médicale.
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
