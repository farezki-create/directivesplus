
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
  
  console.log("Résultat de vérification de la connexion:", connectionResult);
  
  if (!connectionResult.isValid) {
    if (connectionResult.error?.includes("Aucun profil")) {
      showErrorToast("Avertissement", "Aucun profil utilisateur trouvé dans la base de données");
      return {
        isValid: false,
        error: "Aucun profil utilisateur n'existe dans la base de données. Vérifiez que vous êtes connecté à la bonne base de données.",
        errorType: 'noProfiles'
      };
    }
    
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
  
  if (isDebugMode) {
    console.log("Mode débogage activé avec le code:", accessCode);
  }
  
  const accessResult = await verifyAccessCode(accessCode);
  
  console.log("Résultat de vérification du code d'accès:", accessResult);
  
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
  
  console.log("Résultat de récupération du profil:", profileResult);
  
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
