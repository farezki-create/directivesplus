
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import DossierHeader from "@/components/dossier/DossierHeader";
import DirectivesTab from "@/components/dossier/DirectivesTab";
import MedicalDataTab from "@/components/dossier/MedicalDataTab";
import DossierFooter from "@/components/dossier/DossierFooter";
import { useDossierSecurity } from "@/hooks/useDossierSecurity";
import { useDossierSession } from "@/hooks/useDossierSession";

const AffichageDossier: React.FC = () => {
  const { 
    patientInfo, 
    decryptedContent, 
    decryptionError,
    loading, 
    activeTab, 
    setActiveTab,
    hasDirectives,
    getDirectives
  } = useDossierSession();
  
  const { 
    resetActivityTimer, 
    logDossierEvent, 
    handleSecurityClose,
    startSecurityMonitoring,
    stopSecurityMonitoring
  } = useDossierSecurity();
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Log view event and start monitoring on mount
  useEffect(() => {
    logDossierEvent("view", true);
    startSecurityMonitoring();
    
    // Stop monitoring on unmount
    return () => {
      stopSecurityMonitoring();
    };
  }, [logDossierEvent, startSecurityMonitoring, stopSecurityMonitoring]);
  
  // Event handler for tab change
  const handleTabChange = (value: string) => {
    resetActivityTimer();
    setActiveTab(value);
    
    // Log tab change event
    logDossierEvent(`switch_to_${value}`, true);
  };
  
  // Redirect to home if no ID is provided
  if (!id) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="container max-w-4xl py-8" onClick={resetActivityTimer}>
      <Card className="shadow-lg">
        <DossierHeader 
          onClose={handleSecurityClose}
          patientInfo={patientInfo}
        />
        
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="px-6 py-2 border-b">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="directives">Directives Anticipées</TabsTrigger>
              <TabsTrigger value="medical">Données Médicales</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="directives" className="p-0">
            <DirectivesTab 
              decryptedContent={decryptedContent}
              hasDirectives={hasDirectives}
              getDirectives={getDirectives}
              decryptionError={decryptionError}
            />
          </TabsContent>
          
          <TabsContent value="medical" className="p-0">
            <MedicalDataTab 
              decryptedContent={decryptedContent}
              decryptionError={decryptionError}
            />
          </TabsContent>
        </Tabs>
        
        <DossierFooter />
      </Card>
    </div>
  );
};

export default AffichageDossier;
