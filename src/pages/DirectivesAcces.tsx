
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { extractPatientInfo } from "@/utils/patient/patientInfoExtractor";
import PatientHeader from "@/components/directives-access/PatientHeader";
import StatisticsCards from "@/components/directives-access/StatisticsCards";
import DirectivesContent from "@/components/directives-access/DirectivesContent";
import SecurityAlert from "@/components/directives-access/SecurityAlert";
import PersonalDocumentsSection from "@/components/directives-access/PersonalDocumentsSection";

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

  console.log("DirectivesAcces - État:", {
    dossierActif: !!dossierActif,
    isAuthenticated,
    currentPath: window.location.pathname
  });

  // AUCUNE REDIRECTION VERS /auth - Cette page est complètement publique

  const handleReturnHome = () => {
    clearDossierActif();
    navigate("/");
  };

  const handleShowDocuments = () => {
    setShowDocuments(true);
  };

  // CAS 1: Pas de dossier actif ET pas d'utilisateur authentifié
  if (!dossierActif && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader />
        <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Accès aux directives anticipées</h2>
              <p className="text-gray-600 mb-4">
                Pour consulter des directives anticipées, vous pouvez :
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/auth")} 
                  className="w-full"
                >
                  Me connecter à mon compte
                </Button>
                <Button 
                  onClick={() => navigate("/")} 
                  variant="outline"
                  className="w-full"
                >
                  Saisir un code d'accès
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <PageFooter />
      </div>
    );
  }

  // CAS 2: Utilisateur authentifié mais pas de dossier actif
  if (!dossierActif && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader />
        
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-2">
                  Mes Documents Personnels
                </h2>
                <p className="text-blue-700 mb-4">
                  Vous êtes connecté. Consultez vos documents personnels ci-dessous.
                </p>
                <Button onClick={handleReturnHome} variant="outline" size="sm">
                  Retour à l'accueil
                </Button>
              </CardContent>
            </Card>

            <PersonalDocumentsSection
              isAuthenticated={isAuthenticated}
              user={user}
              showDocuments={true}
              documents={documents}
              onShowDocuments={handleShowDocuments}
              onUploadComplete={handleUploadComplete}
              onDownload={handleDownload}
              onPrint={handlePrint}
              onView={handleView}
              onDelete={handleDelete}
            />

            <SecurityAlert />
          </div>
        </main>
        
        <PageFooter />
      </div>
    );
  }

  // CAS 3: Dossier actif (avec ou sans authentification)
  const patientInfo = extractPatientInfo(dossierActif);
  const directives = dossierActif.contenu?.documents || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <PatientHeader 
            patientInfo={patientInfo}
            onReturnHome={handleReturnHome}
          />

          <StatisticsCards directivesCount={directives.length} />

          <DirectivesContent directives={directives} />

          {isAuthenticated && (
            <PersonalDocumentsSection
              isAuthenticated={isAuthenticated}
              user={user}
              showDocuments={showDocuments}
              documents={documents}
              onShowDocuments={handleShowDocuments}
              onUploadComplete={handleUploadComplete}
              onDownload={handleDownload}
              onPrint={handlePrint}
              onView={handleView}
              onDelete={handleDelete}
            />
          )}

          <SecurityAlert />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default DirectivesAcces;
