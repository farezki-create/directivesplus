
import { useDossierStore } from "@/store/dossierStore";

/**
 * Hook pour gérer l'accès en lecture seule
 * Traite l'accès par code comme équivalent à l'authentification mais sans droits d'écriture
 */
export const useReadOnlyAccess = (isAuthenticated: boolean) => {
  const { dossierActif } = useDossierStore();
  
  // Un utilisateur a un accès "équivalent authentifié" s'il est vraiment authentifié 
  // OU s'il a un accès par code d'accès
  const hasEquivalentAuth = isAuthenticated || !!dossierActif;
  
  // Seuls les utilisateurs vraiment authentifiés peuvent écrire
  const hasWriteAccess = isAuthenticated;
  
  // L'accès par code donne un accès lecture seule
  const isReadOnlyAccess = !!dossierActif && !isAuthenticated;
  
  return {
    hasEquivalentAuth,
    hasWriteAccess,
    isReadOnlyAccess,
    dossierActif
  };
};
