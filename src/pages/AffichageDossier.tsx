
import React, { useEffect, useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

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
    getDirectives,
    canAccessDirectives,
    canAccessMedical
  } = useDossierSession();
  
  const { 
    resetActivityTimer, 
    logDossierEvent, 
    handleSecurityClose,
    startSecurityMonitoring,
    stopSecurityMonitoring
  } = useDossierSecurity();
  
  const navigate = useNavigate();
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Vérifier si un dossier est actif dès le chargement
  useEffect(() => {
    const checkDossierActif = () => {
      if (!dossierActif && !loading) {
        console.log("Aucun dossier actif dans AffichageDossier, redirection...");
        navigate('/acces-document', { replace: true });
      }
    };
    
    // Vérification immédiate
    checkDossierActif();
    
    // Re-vérification après un court délai pour laisser le temps au state de se mettre à jour
    const timer = setTimeout(checkDossierActif, 1000);
    
    return () => clearTimeout(timer);
  }, [dossierActif, navigate, loading]);
  
  // Log view event and start monitoring on mount
  useEffect(() => {
    if (dossierActif) {
      console.log("Dossier actif trouvé:", dossierActif.id);
      console.log("Directives only:", dossierActif.isDirectivesOnly);
      console.log("Medical only:", dossierActif.isMedicalOnly);
      
      logDossierEvent("view", true);
      startSecurityMonitoring();
      
      // Si le contenu est vide, essayer de recharger la page une fois
      if (!dossierActif.contenu && loadAttempts === 0) {
        setLoadAttempts(prev => prev + 1);
        const reloadTimer = setTimeout(() => {
          window.location.reload();
        }, 2000);
        
        return () => clearTimeout(reloadTimer);
      }
    }
    
    // Stop monitoring on unmount
    return () => {
      stopSecurityMonitoring();
    };
  }, [dossierActif, logDossierEvent, startSecurityMonitoring, stopSecurityMonitoring, loadAttempts]);
  
  // Event handler for tab change
  const handleTabChange = (value: string) => {
    // Vérifier si l'utilisateur a accès à cet onglet
    if (value === "medical" && !canAccessMedical) {
      console.log("Tentative d'accès aux données médicales refusée");
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas accès aux données médicales avec ce code",
        variant: "destructive"
      });
      return;
    }
    
    if (value === "directives" && !canAccessDirectives) {
      console.log("Tentative d'accès aux directives refusée");
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
  if (!dossierActif) {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="shadow-lg p-8">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
            <p className="text-lg text-red-600 font-medium mb-4">Aucun dossier disponible</p>
            <p className="text-gray-600 mb-4 text-center">
              Nous n'avons pas pu trouver ou charger le dossier demandé. 
              Veuillez réessayer avec un code d'accès valide.
            </p>
            <Button 
              onClick={() => navigate('/acces-document')}
              className="mt-2 px-4 py-2 bg-directiveplus-600 text-white rounded hover:bg-directiveplus-700"
            >
              Retour à la page d'accès
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  // Si le contenu du dossier est vide ou invalide
  if (!decryptedContent && !loading) {
    return (
      <div className="container max-w-4xl py-8">
        <Card className="shadow-lg p-8">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
            <p className="text-lg text-amber-600 font-medium mb-2">Problème de chargement du dossier</p>
            <p className="text-gray-600 mb-4 text-center">
              Le dossier a bien été trouvé, mais son contenu est vide ou ne peut pas être affiché.
              {decryptionError && <span className="block mt-2 text-red-500">{decryptionError}</span>}
            </p>
            <div className="flex space-x-4">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-2"
              >
                Réessayer
              </Button>
              <Button 
                onClick={() => navigate('/acces-document')}
                className="mt-2 bg-directiveplus-600 text-white hover:bg-directiveplus-700"
              >
                Nouveau code d'accès
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
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
              <TabsTrigger 
                value="directives"
                disabled={!canAccessDirectives}
                className={!canAccessDirectives ? "opacity-50 cursor-not-allowed" : ""}
              >
                Directives Anticipées
              </TabsTrigger>
              <TabsTrigger 
                value="medical"
                disabled={!canAccessMedical}
                className={!canAccessMedical ? "opacity-50 cursor-not-allowed" : ""}
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
