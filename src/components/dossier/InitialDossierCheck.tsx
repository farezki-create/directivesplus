
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface InitialDossierCheckProps {
  dossierActif: any;
  loading: boolean;
  initialLoading: boolean;
  loadAttempts: number;
  setLoadAttempts: (attempts: number) => void;
  logDossierEvent: (event: string, success: boolean) => void;
  startSecurityMonitoring: () => void;
  stopSecurityMonitoring: () => void;
}

const InitialDossierCheck: React.FC<InitialDossierCheckProps> = ({
  dossierActif,
  loading,
  initialLoading,
  loadAttempts,
  setLoadAttempts,
  logDossierEvent,
  startSecurityMonitoring,
  stopSecurityMonitoring
}) => {
  const navigate = useNavigate();

  // Vérifier si un dossier est actif dès le chargement
  useEffect(() => {
    const checkDossierActif = () => {
      if (!dossierActif && !loading && !initialLoading) {
        console.log("Aucun dossier actif, redirection...");
        navigate('/acces-document', { replace: true });
      }
    };
    
    // Vérification immédiate
    checkDossierActif();
    
    // Re-vérification après un court délai pour laisser le temps au state de se mettre à jour
    const timer = setTimeout(checkDossierActif, 1000);
    
    return () => clearTimeout(timer);
  }, [dossierActif, navigate, loading, initialLoading]);
  
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
        // Fix: pass the new value directly instead of using a function
        setLoadAttempts(1);
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
  }, [dossierActif, logDossierEvent, startSecurityMonitoring, stopSecurityMonitoring, loadAttempts, setLoadAttempts]);
  
  return null; // Ce composant ne rend rien, il gère seulement la logique
};

export default InitialDossierCheck;
