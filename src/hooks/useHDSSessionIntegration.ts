
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HDSSessionManager } from '@/utils/security/hdsSessionManager';

/**
 * Hook pour intégrer automatiquement la gestion HDS dans l'authentification
 */
export const useHDSSessionIntegration = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialiser la session HDS conforme
      HDSSessionManager.setSessionStartTime();
      HDSSessionManager.initializeHDSSession();
      
      
    } else {
      // Nettoyer si pas authentifié
      HDSSessionManager.destroy();
    }

    // Cleanup au démontage
    return () => {
      if (!isAuthenticated) {
        HDSSessionManager.destroy();
      }
    };
  }, [isAuthenticated, user]);

  // Vérification périodique de la session
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInterval = setInterval(() => {
      const isValid = HDSSessionManager.isSessionValid();
      if (!isValid) {
        
        window.location.href = '/auth';
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(checkInterval);
  }, [isAuthenticated]);
};
