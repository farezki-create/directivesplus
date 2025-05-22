
import React, { useEffect } from 'react';
import { useDossierStore } from '@/store/dossierStore';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Dossier } from '@/store/dossierStore';

interface InitialDossierCheckProps {
  onComplete: () => void;
  onError: (message: string) => void;
  dossierActif?: Dossier | null;
  loading?: boolean;
  initialLoading?: boolean;
  loadAttempts?: number;
  setLoadAttempts?: React.Dispatch<React.SetStateAction<number>>;
  logDossierEvent?: (action: string, success: boolean) => void;
  startSecurityMonitoring?: () => void;
  stopSecurityMonitoring?: () => void;
}

const InitialDossierCheck: React.FC<InitialDossierCheckProps> = ({ 
  onComplete,
  onError,
  dossierActif,
  loading,
  initialLoading,
  loadAttempts,
  setLoadAttempts,
  logDossierEvent,
  startSecurityMonitoring,
  stopSecurityMonitoring
}) => {
  const { dossierActif: storeDossier } = useDossierStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Use dossier from props or from store
  const activeDossier = dossierActif || storeDossier;

  useEffect(() => {
    // Start security monitoring if available
    if (startSecurityMonitoring) {
      startSecurityMonitoring();
    }
    
    // Log the event if the function is provided
    if (logDossierEvent) {
      logDossierEvent("dossier_check_started", true);
    }
    
    // Check if there's an active dossier
    if (!activeDossier) {
      // If user is authenticated, redirect to dashboard
      if (isAuthenticated && user) {
        if (logDossierEvent) {
          logDossierEvent("dossier_not_found_authenticated", false);
        }
        
        toast({
          title: "Aucun dossier actif",
          description: "Vous allez être redirigé vers votre tableau de bord",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }
      
      // If not authenticated, redirect to login
      if (logDossierEvent) {
        logDossierEvent("dossier_not_found_unauthenticated", false);
      }
      
      onError("Aucun dossier actif. Veuillez vous connecter ou utiliser un code d'accès.");
      return;
    }
    
    // If there is an active dossier, continue
    if (logDossierEvent) {
      logDossierEvent("dossier_check_completed", true);
    }
    
    onComplete();
    
    return () => {
      // Stop security monitoring on unmount if available
      if (stopSecurityMonitoring) {
        stopSecurityMonitoring();
      }
    };
  }, [
    activeDossier, 
    isAuthenticated, 
    user, 
    navigate, 
    onComplete, 
    onError, 
    logDossierEvent, 
    startSecurityMonitoring, 
    stopSecurityMonitoring
  ]);

  return null; // This component doesn't render anything
};

export default InitialDossierCheck;
