
import React, { useEffect } from 'react';
import { useDossierStore } from '@/store/dossierStore';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface InitialDossierCheckProps {
  onComplete: () => void;
  onError: (message: string) => void;
}

const InitialDossierCheck: React.FC<InitialDossierCheckProps> = ({ 
  onComplete,
  onError
}) => {
  const { dossierActif } = useDossierStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's an active dossier
    if (!dossierActif) {
      // If user is authenticated, redirect to dashboard
      if (isAuthenticated && user) {
        toast({
          title: "Aucun dossier actif",
          description: "Vous allez être redirigé vers votre tableau de bord",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }
      
      // If not authenticated, redirect to login
      onError("Aucun dossier actif. Veuillez vous connecter ou utiliser un code d'accès.");
      return;
    }
    
    // If there is an active dossier, continue
    onComplete();
  }, [dossierActif, isAuthenticated, user, navigate, onComplete, onError]);

  return null; // This component doesn't render anything
};

export default InitialDossierCheck;
