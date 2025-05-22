
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import DossierHeader from "@/components/dossier/DossierHeader";
import DossierFooter from "@/components/dossier/DossierFooter";
import DossierTabContent from "@/components/dossier/DossierTabContent";
import DossierLoadingState from "@/components/dossier/DossierLoadingState";
import DossierErrorState from "@/components/dossier/DossierErrorState";
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
  
  // Afficher un état de chargement pendant que les données sont récupérées
  if (loading) {
    return <DossierLoadingState />;
  }
  
  // Si pas de dossier actif après le chargement, ne rien afficher
  if (!dossierActif) {
    return (
      <DossierErrorState 
        title="Aucun dossier disponible"
        description="Nous n'avons pas pu trouver ou charger le dossier demandé. Veuillez réessayer avec un code d'accès valide."
      />
    );
  }
  
  // Si le contenu du dossier est vide ou invalide
  if (!decryptedContent && !loading) {
    return (
      <DossierErrorState 
        title="Problème de chargement du dossier"
        description="Le dossier a bien été trouvé, mais son contenu est vide ou ne peut pas être affiché."
        showRetry={true}
        decryptionError={decryptionError}
      />
    );
  }
  
  return (
    <div className="container max-w-4xl py-8" onClick={resetActivityTimer}>
      <Card className="shadow-lg">
        <DossierHeader 
          onClose={handleSecurityClose}
          patientInfo={patientInfo}
        />
        
        <DossierTabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          canAccessDirectives={canAccessDirectives}
          canAccessMedical={canAccessMedical}
          decryptedContent={decryptedContent}
          decryptionError={decryptionError}
          hasDirectives={hasDirectives}
          getDirectives={getDirectives}
          resetActivityTimer={resetActivityTimer}
          logDossierEvent={logDossierEvent}
        />
        
        <DossierFooter />
      </Card>
    </div>
  );
};

export default AffichageDossier;
