
import { showErrorToast } from "@/utils/access";
import { verifyDatabaseConnection } from "./connection";
import { verifyAccessCode } from "./accessCode";
import { fetchUserProfile, validateUserData } from "./profile";
import { DirectivesFormData, DirectivesVerificationResult } from "./types";

// Processus complet de vérification d'accès
export const verifyDirectivesAccess = async (
  formData: DirectivesFormData
): Promise<DirectivesVerificationResult> => {
  // Vérifier d'abord la connexion à la base de données
  const connectionResult = await verifyDatabaseConnection();
  if (!connectionResult.isValid) {
    showErrorToast("Erreur", "Problème de connexion à la base de données");
    return {
      isValid: false,
      error: connectionResult.error,
      errorType: 'connection'
    };
  }
  
  // Vérifier le code d'accès
  const accessCode = formData.accessCode.trim();
  const isDebugMode = accessCode.toUpperCase() === "TEST" || accessCode.toUpperCase() === "DEMO";
  
  const accessResult = await verifyAccessCode(accessCode);
  if (!accessResult.isValid) {
    showErrorToast("Accès refusé", accessResult.error || "Code d'accès invalide");
    return {
      isValid: false,
      error: accessResult.error,
      errorType: accessResult.errorType
    };
  }
  
  // Récupérer le profil utilisateur
  const userId = accessResult.userId as string;
  const profileResult = await fetchUserProfile(userId);
  
  if (!profileResult.isValid) {
    showErrorToast("Erreur", "Profil introuvable");
    return {
      isValid: false,
      error: profileResult.error,
      errorType: 'general'
    };
  }
  
  // Vérifier les données utilisateur
  const isUserDataValid = validateUserData(formData, profileResult.profileData, isDebugMode);
  
  if (isUserDataValid) {
    return {
      isValid: true,
      userId,
      profileData: profileResult.profileData
    };
  } else {
    return {
      isValid: false,
      error: "Les informations personnelles ne correspondent pas au profil associé à ce code d'accès.",
      errorType: 'general'
    };
  }
};
