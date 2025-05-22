
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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

// Simplified component since direct access without login has been removed
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
  
  React.useEffect(() => {
    // No active dossier check
    if (!initialLoading && !loading && !dossierActif) {
      console.log("No active dossier found, redirecting to login");
      logDossierEvent("dossier_not_found", false);
      
      // Stop security monitoring if it was started
      stopSecurityMonitoring();
      
      // Redirect to login page with error message
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour accéder à cette fonctionnalité",
        variant: "destructive"
      });
      
      navigate("/auth", { state: { from: "/affichage-dossier" } });
    } else if (dossierActif && !initialLoading) {
      // Start security monitoring for the dossier
      console.log("Dossier access granted, starting security monitoring");
      logDossierEvent("dossier_access_granted", true);
      startSecurityMonitoring();
    }
  }, [dossierActif, initialLoading, loading, navigate, logDossierEvent, startSecurityMonitoring, stopSecurityMonitoring]);
  
  // Increment load attempts and redirect after too many attempts
  React.useEffect(() => {
    if (loading && loadAttempts > 3) {
      logDossierEvent("dossier_load_timeout", false);
      stopSecurityMonitoring();
      
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger le dossier après plusieurs tentatives.",
        variant: "destructive"
      });
      
      navigate("/");
    } else if (loading && !initialLoading) {
      // Increment load attempts
      const timer = setTimeout(() => {
        setLoadAttempts(loadAttempts + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, loadAttempts, setLoadAttempts, navigate, logDossierEvent, stopSecurityMonitoring, initialLoading]);
  
  return null; // This component doesn't render anything
};

export default InitialDossierCheck;
