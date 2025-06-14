
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HDSSessionManager } from '@/utils/security/hdsSessionManager';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook pour gérer les sessions conformes HDS
 */
export const useHDSSession = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /**
   * Initialise la session HDS pour un utilisateur authentifié
   */
  const initializeSession = useCallback(() => {
    if (user) {
      HDSSessionManager.setSessionStartTime();
      HDSSessionManager.initializeHDSSession();
    }
  }, [user]);

  /**
   * Vérifie périodiquement la validité de la session
   */
  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      const isValid = HDSSessionManager.isSessionValid();
      if (!isValid) {
        navigate('/auth');
      }
    };

    // Vérifier immédiatement
    checkSession();

    // Vérifier toutes les minutes
    const interval = setInterval(checkSession, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [user, navigate]);

  /**
   * Nettoyage à la déconnexion
   */
  useEffect(() => {
    return () => {
      HDSSessionManager.destroy();
    };
  }, []);

  return {
    initializeSession
  };
};
