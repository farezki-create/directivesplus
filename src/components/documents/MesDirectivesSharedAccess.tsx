
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle, FileText } from "lucide-react";
import { DocumentCardRefactored } from "./card/DocumentCardRefactored";
import AppNavigation from "@/components/AppNavigation";
import { Document } from "@/types/documents";

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

export function MesDirectivesSharedAccess() {
  const [searchParams] = useSearchParams();
  const sharedCode = searchParams.get('shared_code');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: ''
  });

  const handleVerifyAccess = async () => {
    if (!sharedCode || !formData.firstName || !formData.lastName || !formData.birthDate) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data: sharedDocuments, error } = await supabase
        .from('shared_documents')
        .select('*')
        .eq('access_code', sharedCode)
        .eq('is_active', true);

      if (error || !sharedDocuments || sharedDocuments.length === 0) {
        throw new Error("Code d'accès invalide ou expiré");
      }

      // Vérifier l'identité avec le profil de l'utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sharedDocuments[0].user_id)
        .single();

      if (profileError || !profile) {
        throw new Error("Impossible de vérifier l'identité");
      }

      // Vérifier que l'identité correspond
      const firstNameMatch = profile.first_name?.toLowerCase().trim() === formData.firstName.toLowerCase().trim();
      const lastNameMatch = profile.last_name?.toLowerCase().trim() === formData.lastName.toLowerCase().trim();
      const birthDateMatch = profile.birth_date === formData.birthDate;

      if (!firstNameMatch || !lastNameMatch || !birthDateMatch) {
        throw new Error("Les informations fournies ne correspondent pas");
      }

      // Vérifier que les documents ne sont pas expirés
      const validDocuments = sharedDocuments.filter(doc => 
        !doc.expires_at || new Date(doc.expires_at) > new Date()
      );

      if (validDocuments.length === 0) {
        throw new Error("Tous les documents partagés ont expiré");
      }

      // Transformer les documents partagés en format Document
      const transformedDocuments: Document[] = validDocuments.map((sharedDoc, index) => ({
        id: sharedDoc.document_id,
        user_id: sharedDoc.user_id,
        file_name: sharedDoc.document_data.file_name,
        file_path: sharedDoc.document_data.file_path,
        file_type: 'pdf',
        content_type: sharedDoc.document_data.content_type || 'application/pdf',
        created_at: sharedDoc.shared_at,
        description: sharedDoc.document_data.description,
        file_size: null,
        updated_at: null,
        external_id: null
      }));

      setDocuments(transformedDocuments);
      setIsVerified(true);
      
      toast({
        title: "Accès autorisé",
        description: `${transformedDocuments.length} document(s) disponible(s)`,
      });

    } catch (error: any) {
      console.error("Erreur lors de la vérification:", error);
      toast({
        title: "Accès refusé",
        description: error.message || "Impossible de vérifier l'accès",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDocumentAction = (action: string) => {
    // Actions limitées en mode lecture seule
    toast({
      title: "Action non disponible",
      description: "Seule la consultation est autorisée via ce lien de partage",
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
                Code manquant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Aucun code de partage n'a été fourni dans l'URL.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNavigation hideEditingFeatures={true} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                Accès sécurisé aux directives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Pour accéder aux documents partagés, veuillez confirmer votre identité :
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Votre prénom"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Nom de famille</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Votre nom de famille"
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthDate">Date de naissance</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleVerifyAccess} 
                disabled={isVerifying}
                className="w-full"
              >
                {isVerifying ? "Vérification..." : "Accéder aux documents"}
              </Button>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  🔒 Vos informations sont utilisées uniquement pour vérifier votre identité et ne sont pas stockées.
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Documents partagés
            </h1>
            <p className="text-gray-600">
              Vous consultez {documents.length} document(s) en mode lecture seule
            </p>
          </div>

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
                  onDownload={(filePath, fileName) => {
                    // Permettre le téléchargement
                    const link = document.createElement('a');
                    link.href = filePath;
                    link.download = fileName;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  onPrint={(filePath) => {
                    // Permettre l'impression
                    const printWindow = window.open(filePath, '_blank');
                    if (printWindow) {
                      printWindow.onload = () => {
                        printWindow.print();
                      };
                    }
                  }}
                  onView={(filePath) => {
                    // Permettre la visualisation
                    window.open(filePath, '_blank');
                  }}
                  onDelete={() => handleDocumentAction('delete')}
                  showPrint={true}
                  showShare={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
