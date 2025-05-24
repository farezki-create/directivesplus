
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

  useEffect(() => {
    console.log("DirectivesAcces - Dossier actif:", dossierActif);
    console.log("DirectivesAcces - Authentifié:", isAuthenticated);
    
    // UNIQUEMENT rediriger si pas de dossier ET pas d'utilisateur authentifié
    // Si il y a un dossier actif, on autorise l'accès même sans authentification
    if (!dossierActif && !isAuthenticated) {
      console.log("Aucun dossier actif et pas authentifié, redirection vers l'accueil");
      navigate("/");
      return;
    }

    // Si utilisateur authentifié mais pas de dossier, on reste sur la page
    if (isAuthenticated && !dossierActif) {
      console.log("Utilisateur authentifié sans dossier actif - affichage de la page");
    }

    // Si dossier actif (avec ou sans authentification), on reste sur la page
    if (dossierActif) {
      console.log("Dossier actif présent - affichage de la page");
    }
  }, [dossierActif, isAuthenticated, navigate]);

  const handleReturnHome = () => {
    clearDossierActif();
    navigate("/");
  };

  const handleShowDocuments = () => {
    setShowDocuments(true);
  };

  // Si pas de dossier actif ET pas d'utilisateur authentifié
  if (!dossierActif && !isAuthenticated) {
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

  // Si utilisateur authentifié mais pas de dossier, afficher les documents personnels uniquement
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

            {/* Section documents personnels */}
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

            {/* Informations de sécurité */}
            <SecurityAlert />
          </div>
        </main>
        
        <PageFooter />
      </div>
    );
  }

  // Cas avec dossier actif (avec ou sans authentification)
  const patientInfo = extractPatientInfo(dossierActif);
  const directives = dossierActif.contenu?.documents || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* En-tête avec informations du patient */}
          <PatientHeader 
            patientInfo={patientInfo}
            onReturnHome={handleReturnHome}
          />

          {/* Statistiques */}
          <StatisticsCards directivesCount={directives.length} />

          {/* Contenu des directives */}
          <DirectivesContent directives={directives} />

          {/* Section documents personnels si connecté */}
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

          {/* Informations de sécurité */}
          <SecurityAlert />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default DirectivesAcces;
