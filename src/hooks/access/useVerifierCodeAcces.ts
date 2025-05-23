
import { useState } from "react";
import { useAuthenticatedDossier } from "./useAuthenticatedDossier";
import { useCodeVerification } from "./useCodeVerification";
import { Dossier } from "../types/dossierTypes";

/**
 * Main hook for verifying access codes and retrieving user dossiers
 */
export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState(false);
  
  // Use the extracted hooks for specific functionality
  const { verifyCode } = useCodeVerification(setLoading);
  const { getDossierAuthenticated } = useAuthenticatedDossier(setLoading);

  return {
    verifierCode: verifyCode,
    getDossierUtilisateurAuthentifie: getDossierAuthenticated,
    loading
  };
};
