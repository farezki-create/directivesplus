
import React, { useEffect } from "react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { useDossierSession } from "@/hooks/useDossierSession";
import { useDossierSecurity } from "@/hooks/useDossierSecurity";
import PatientInfoCard from "@/components/dossier/PatientInfoCard";
import DossierHeader from "@/components/dossier/DossierHeader";
import MedicalDataTab from "@/components/dossier/MedicalDataTab";
import DirectivesTab from "@/components/dossier/DirectivesTab";
import DossierFooter from "@/components/dossier/DossierFooter";

const AffichageDossier: React.FC = () => {
  const {
    dossierActif,
    decryptedContent,
    decryptionError,
    hasDirectives,
    getDirectives,
    patientInfo,
    handleCloseDossier
  } = useDossierSession();
  
  // Initialize security hook
  const { resetActivityTimer } = useDossierSecurity(
    dossierActif?.id,
    handleCloseDossier
  );
  
  // Reset activity timer on component mount and log data for debugging
  useEffect(() => {
    resetActivityTimer();
    console.log("AffichageDossier - Dossier actif:", dossierActif);
    console.log("AffichageDossier - Contenu déchiffré:", decryptedContent);
    console.log("AffichageDossier - Directives disponibles:", hasDirectives);
    
    // Vérifier si getDirectives fonctionne
    if (getDirectives) {
      const directives = getDirectives();
      console.log("AffichageDossier - Test getDirectives:", directives);
    }
  }, [resetActivityTimer, dossierActif, decryptedContent, hasDirectives, getDirectives]);

  if (!dossierActif) {
    return null;
  }

  // Déterminer quel onglet doit être actif par défaut en fonction du type de dossier
  const isDirectivesOnly = dossierActif.isDirectivesOnly;
  const isMedicalOnly = dossierActif.isMedicalOnly;
  const defaultTab = isDirectivesOnly ? "directives" : "dossier";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-6">
        <DossierHeader 
          dossierId={dossierActif.id} 
          onClose={handleCloseDossier} 
        />
        
        <div className="max-w-4xl mx-auto">
          <PatientInfoCard patientInfo={patientInfo} />
          
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              {!isDirectivesOnly && (
                <TabsTrigger value="dossier" disabled={isDirectivesOnly}>Données médicales</TabsTrigger>
              )}
              {!isMedicalOnly && (
                <TabsTrigger value="directives" disabled={isMedicalOnly} className="flex items-center gap-1">
                  <FileText size={16} />
                  Directives anticipées
                  {hasDirectives && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 ml-1 rounded-full">
                      Disponible
                    </span>
                  )}
                </TabsTrigger>
              )}
            </TabsList>
            
            {!isDirectivesOnly && (
              <TabsContent value="dossier">
                <MedicalDataTab 
                  decryptedContent={decryptedContent} 
                  decryptionError={decryptionError}
                />
              </TabsContent>
            )}
            
            {!isMedicalOnly && (
              <TabsContent value="directives">
                <DirectivesTab 
                  decryptedContent={decryptedContent}
                  hasDirectives={hasDirectives === true}
                  getDirectives={getDirectives}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      
      <DossierFooter />
    </div>
  );
};

export default AffichageDossier;
