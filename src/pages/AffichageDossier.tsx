
import React, { useEffect } from "react";
import { useDossierSession } from "@/hooks/useDossierSession";
import { useDossierSecurity } from "@/hooks/useDossierSecurity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DossierHeader from "@/components/dossier/DossierHeader";
import DossierFooter from "@/components/dossier/DossierFooter";
import PatientInfoCard from "@/components/dossier/PatientInfoCard";
import DirectivesTab from "@/components/dossier/DirectivesTab";
import MedicalDataTab from "@/components/dossier/MedicalDataTab";
import BackButton from "@/components/ui/back-button";
import LoadingState from "@/components/questionnaire/LoadingState";

const AffichageDossier = () => {
  const { 
    dossierActif,
    decryptedContent,
    decryptionError,
    hasDirectives,
    getDirectives,
    patientInfo,
    handleCloseDossier
  } = useDossierSession();
  
  // Use security hook only if we have an active dossier to avoid React errors
  const securityHook = dossierActif ? useDossierSecurity() : null;
  
  useEffect(() => {
    // Only start security monitoring if we have an active dossier
    if (dossierActif && securityHook) {
      securityHook.startSecurityMonitoring();
      return () => securityHook.stopSecurityMonitoring();
    }
  }, [dossierActif, securityHook]);

  if (!dossierActif) {
    return <LoadingState loading={true} message="Chargement du dossier..." />;
  }

  if (decryptionError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <Card className="p-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de déchiffrement</h1>
          <p>Impossible de déchiffrer les données du dossier.</p>
          <div className="mt-4">
            <button
              onClick={handleCloseDossier}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Fermer le dossier
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      
      <DossierHeader 
        onClose={handleCloseDossier}
        patientInfo={patientInfo}
      />
      
      <div className="mb-6">
        <PatientInfoCard patientInfo={patientInfo} />
      </div>
      
      <Tabs defaultValue="directives" className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="directives">Directives anticipées</TabsTrigger>
          <TabsTrigger value="medical-data">Données médicales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="directives" className="space-y-4">
          <DirectivesTab 
            decryptedContent={decryptedContent}
            hasDirectives={hasDirectives}
            getDirectives={getDirectives}
          />
        </TabsContent>
        
        <TabsContent value="medical-data" className="space-y-4">
          <MedicalDataTab decryptedContent={decryptedContent} />
        </TabsContent>
      </Tabs>
      
      <DossierFooter />
    </div>
  );
};

export default AffichageDossier;
