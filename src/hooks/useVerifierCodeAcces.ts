
import { useState } from "react";
import { verifyCodeWithRetries, getAuthUserDossierWithRetries } from "@/api/dossier";

/**
 * Hook pour vérifier les codes d'accès et récupérer les dossiers
 */
export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  /**
   * Vérifie un code d'accès et récupère le dossier correspondant
   * @param code Code d'accès saisi par l'utilisateur 
   * @param bruteForceIdentifier Identifiant de contexte pour la vérification
   * @returns Dossier si la vérification est réussie, null sinon
   */
  const verifierCode = async (code: string, bruteForceIdentifier?: string) => {
    if (!code || code.trim() === '') {
      const errorMessage = "Veuillez saisir un code d'accès valide";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    setError(null);
    setLoading(true);
    setRetryCount(0);
    
    try {
      const result = await verifyCodeWithRetries(code, bruteForceIdentifier);
      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère le dossier de l'utilisateur authentifié
   * @param userId ID de l'utilisateur authentifié
   * @param bruteForceIdentifier Identifiant pour le contexte spécifique (directives ou médical)
   * @returns Le dossier de l'utilisateur ou null
   */
  const getDossierUtilisateurAuthentifie = async (userId: string, bruteForceIdentifier?: string) => {
    if (!userId) {
      setError("Utilisateur non authentifié");
      return { success: false, error: "Utilisateur non authentifié" };
    }
    
    setError(null);
    setLoading(true);
    setRetryCount(0);
    
    try {
      const result = await getAuthUserDossierWithRetries(userId, bruteForceIdentifier);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifierCode,
    getDossierUtilisateurAuthentifie,
    loading,
    error,
    retryCount
  };
};
