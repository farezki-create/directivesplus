
import React, { useEffect, useState } from "react";
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
import DocumentsLinkSection from "@/components/dossier/DocumentsLinkSection";

const AffichageDossier: React.FC = () => {
  const {
    dossierActif,
    decryptedContent,
    decryptionError,
    hasDirectives,
    patientInfo,
    handleCloseDossier
  } = useDossierSession();
  
  // Initialize security hook
  const { resetActivityTimer } = useDossierSecurity(
    dossierActif?.id,
    handleCloseDossier
  );
  
  // Reset activity timer on component mount
  useEffect(() => {
    resetActivityTimer();
  }, [resetActivityTimer]);

  if (!dossierActif) {
    return null;
  }

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
          
          {/* Section de liens vers les documents - maintenant avec les vrais liens */}
          <DocumentsLinkSection dossierId={dossierActif.id} />
          
          <Tabs defaultValue="dossier" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="dossier">Données médicales</TabsTrigger>
              <TabsTrigger value="directives" className="flex items-center gap-1">
                <FileText size={16} />
                Directives anticipées
                {hasDirectives && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 ml-1 rounded-full">
                    Disponible
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dossier">
              <MedicalDataTab 
                decryptedContent={decryptedContent} 
                decryptionError={decryptionError}
              />
            </TabsContent>
            
            <TabsContent value="directives">
              <DirectivesTab 
                decryptedContent={decryptedContent}
                hasDirectives={hasDirectives}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <DossierFooter />
    </div>
  );
};

export default AffichageDossier;
