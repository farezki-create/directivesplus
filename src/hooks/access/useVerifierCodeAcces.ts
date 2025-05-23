
import { useState } from "react";
import { useAuthenticatedDossier } from "./useAuthenticatedDossier";
import { useCodeVerification } from "./useCodeVerification";
import type { Dossier } from "../types/dossierTypes";

/**
 * Main hook for verifying access codes and retrieving user dossiers
 */
export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState(false);
  
  // Use the extracted hooks for specific functionality
  const { verifyCode } = useCodeVerification(setLoading);
  const { getDossierAuthenticated } = useAuthenticatedDossier(setLoading);

  // Wrapper function for verifyCode with better error handling
  const verifierCode = async (code: string, identifier?: string): Promise<Dossier | null> => {
    try {
      console.log(`Vérification du code: ${code} avec identifiant: ${identifier || 'non fourni'}`);
      const dossier = await verifyCode(code, identifier);
      return dossier;
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error);
      return null;
    }
  };

  return {
    verifierCode,
    getDossierUtilisateurAuthentifie: getDossierAuthenticated,
    loading
  };
};

// Re-export for backward compatibility
export type { Dossier } from "../types/dossierTypes";
