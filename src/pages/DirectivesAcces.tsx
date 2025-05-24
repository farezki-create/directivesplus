
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import DirectivesPageContent from "@/components/documents/DirectivesPageContent";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";

const DirectivesAcces = () => {
  const navigate = useNavigate();
  const { dossierActif, clearDossierActif } = useDossierStore();
  const [showDocuments, setShowDocuments] = useState(false);

  // Hook pour les documents (si l'utilisateur est connecté)
  const {
    user,
    isAuthenticated,
    documents,
    handleUploadComplete,
    handleDownload,
    handlePrint,
    handleView,
    handleDelete
  } = useDirectivesDocuments();

  useEffect(() => {
    console.log("DirectivesAcces - Dossier actif:", dossierActif);
    
    // Si pas de dossier actif, rediriger vers l'accueil
    if (!dossierActif) {
      console.log("Aucun dossier actif, redirection vers l'accueil");
      navigate("/");
    }
  }, [dossierActif, navigate]);

  const handleReturnHome = () => {
    clearDossierActif();
    navigate("/");
  };

  const handleShowDocuments = () => {
    setShowDocuments(true);
  };

  if (!dossierActif) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader />
        <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">Aucun dossier patient actif.</p>
              <Button onClick={() => navigate("/")} variant="outline">
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </main>
        <PageFooter />
      </div>
    );
  }

  const patientData = dossierActif.profileData || dossierActif.contenu?.patient;
  const directives = dossierActif.contenu?.documents || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* En-tête avec informations du patient */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-green-600" />
                  <div>
                    <CardTitle className="text-green-800">
                      Dossier Patient - Accès Autorisé
                    </CardTitle>
                    <p className="text-green-700 text-sm mt-1">
                      Consultation des directives anticipées
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleReturnHome}
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Fermer l'accès
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-green-800">Patient</p>
                  <p className="text-green-700">
                    {patientData?.prenom || patientData?.first_name} {patientData?.nom || patientData?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Date de naissance</p>
                  <p className="text-green-700">
                    {patientData?.date_naissance || patientData?.birth_date}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{directives.length}</p>
                <p className="text-sm text-gray-600">Document(s) trouvé(s)</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <p className="text-2xl font-bold text-green-600">Autorisé</p>
                <p className="text-sm text-gray-600">Accès validé</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Info className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-600">Simple</p>
                <p className="text-sm text-gray-600">Mode d'accès</p>
              </CardContent>
            </Card>
          </div>

          {/* Contenu des directives */}
          {directives.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Directives Anticipées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {directives.map((directive, index) => (
                    <div key={directive.id || index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {directive.content?.title || directive.titre || `Document ${index + 1}`}
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {directive.created_at ? new Date(directive.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                        </span>
                      </div>
                      
                      {/* Affichage du contenu selon le type */}
                      {directive.content && typeof directive.content === 'object' ? (
                        <div className="text-sm text-gray-600">
                          <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
                            {JSON.stringify(directive.content, null, 2)}
                          </pre>
                        </div>
                      ) : directive.contenu ? (
                        <div className="text-sm text-gray-700">
                          {directive.contenu}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Contenu de la directive disponible
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert className="border-amber-200 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Aucun document de directives anticipées trouvé pour ce patient.
              </AlertDescription>
            </Alert>
          )}

          {/* Section documents personnels si connecté */}
          {isAuthenticated && user && (
            <Card>
              <CardHeader>
                <CardTitle>Mes Documents Personnels</CardTitle>
                <p className="text-sm text-gray-600">
                  Vous êtes connecté. Vous pouvez également consulter vos propres documents.
                </p>
              </CardHeader>
              <CardContent>
                {!showDocuments ? (
                  <Button onClick={handleShowDocuments} variant="outline" className="w-full">
                    Afficher mes documents personnels
                  </Button>
                ) : (
                  <DirectivesPageContent
                    documents={documents}
                    showAddOptions={false}
                    setShowAddOptions={() => {}}
                    userId={user.id}
                    onUploadComplete={handleUploadComplete}
                    onDownload={handleDownload}
                    onPrint={handlePrint}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Informations de sécurité */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Information de sécurité :</strong> Cet accès a été journalisé. 
              La consultation de ce dossier est tracée conformément aux exigences réglementaires.
            </AlertDescription>
          </Alert>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default DirectivesAcces;
