
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import DossierHeader from "@/components/dossier/DossierHeader";
import DirectivesTab from "@/components/dossier/DirectivesTab";
import MedicalDataTab from "@/components/dossier/MedicalDataTab";
import DossierFooter from "@/components/dossier/DossierFooter";
import { useDossierSecurity } from "@/hooks/useDossierSecurity";
import { useDossierSession } from "@/hooks/useDossierSession";
import { useDossierStore } from "@/store/dossierStore";

const AffichageDossier: React.FC = () => {
  const { dossierActif } = useDossierStore();
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
  
  const navigate = useNavigate();
  
  // Vérifier si un dossier est actif
  useEffect(() => {
    // Cette vérification doit être faite APRÈS le premier rendu
    if (!dossierActif && !loading) {
      console.log("Aucun dossier actif dans AffichageDossier, redirection...");
      // Utiliser un timeout pour éviter les problèmes de navigation pendant le rendu
      const timer = setTimeout(() => {
        navigate('/acces-document', { replace: true });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dossierActif, navigate, loading]);
  
  // Log view event and start monitoring on mount
  useEffect(() => {
    if (dossierActif) {
      logDossierEvent("view", true);
      startSecurityMonitoring();
    }
    
    // Stop monitoring on unmount
    return () => {
      stopSecurityMonitoring();
    };
  }, [dossierActif, logDossierEvent, startSecurityMonitoring, stopSecurityMonitoring]);
  
  // Event handler for tab change
  const handleTabChange = (value: string) => {
    // Vérifier si l'utilisateur a accès à cet onglet
    if (value === "medical" && dossierActif?.isDirectivesOnly) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas accès aux données médicales avec ce code",
        variant: "destructive"
      });
      return;
    }
    
    if (value === "directives" && dossierActif?.isMedicalOnly) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas accès aux directives anticipées avec ce code",
        variant: "destructive"
      });
      return;
    }
    
    resetActivityTimer();
    setActiveTab(value);
    
    // Log tab change event
    logDossierEvent(`switch_to_${value}`, true);
  };
  
  // Afficher un état de chargement pendant que les données sont récupérées
  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="shadow-lg p-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
            <p className="mt-4 text-gray-600">Chargement du dossier en cours...</p>
          </div>
        </Card>
      </div>
    );
  }
  
  // Si pas de dossier actif après le chargement, ne rien afficher
  // La redirection sera gérée par l'effet ci-dessus
  if (!dossierActif) {
    return null;
  }
  
  // Import manquant pour toast
  const { toast } = require("@/hooks/use-toast");
  
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
              <TabsTrigger 
                value="directives"
                disabled={dossierActif.isMedicalOnly}
              >
                Directives Anticipées
              </TabsTrigger>
              <TabsTrigger 
                value="medical"
                disabled={dossierActif.isDirectivesOnly}
              >
                Données Médicales
              </TabsTrigger>
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
