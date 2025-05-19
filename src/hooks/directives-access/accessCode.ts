
import { supabase } from "@/integrations/supabase/client";
import { checkDirectivesAccessCode } from "@/utils/access";
import { AccessCodeVerificationResult, AccessCodeCheckResult } from "./types";

// Vérifier le code d'accès et récupérer l'ID utilisateur
export const verifyAccessCode = async (accessCode: string): Promise<AccessCodeVerificationResult> => {
  console.log(`Vérification du code d'accès: "${accessCode}"`);
  
  // Vérification du code d'accès avec la version améliorée
  const accessResult: AccessCodeCheckResult = await checkDirectivesAccessCode(accessCode);
  
  if (accessResult.error) {
    console.error("Erreur lors de la vérification du code d'accès:", accessResult.error, accessResult.details);
    
    // Messages d'erreur personnalisés selon le type d'erreur
    if (accessResult.noProfiles) {
      return {
        isValid: false,
        error: "Aucun profil n'existe dans la base de données. Impossible de vérifier le code d'accès.",
        errorType: 'noProfiles',
        details: accessResult.details
      };
    } else if (accessResult.invalidCode) {
      return {
        isValid: false,
        error: "Code d'accès invalide ou incorrect. Veuillez vérifier que vous avez entré le bon code.",
        errorType: 'invalidCode',
        details: accessResult.details
      };
    } else {
      return {
        isValid: false,
        error: `Erreur lors de la vérification: ${accessResult.error}`,
        errorType: 'general',
        details: accessResult.details
      };
    }
  }
  
  const accessData = accessResult.data;
  
  if (!accessData || accessData.length === 0) {
    console.log("Code d'accès directives invalide ou résultat vide");
    return {
      isValid: false,
      error: "Code d'accès invalide ou incorrect. Veuillez vérifier que vous avez entré le bon code.",
      errorType: 'invalidCode'
    };
  }
  
  const accessItem = accessData[0];
  console.log("Données d'accès récupérées:", accessItem);
  
  if (!('user_id' in accessItem)) {
    console.error("Format de données d'accès invalide:", accessItem);
    return {
      isValid: false,
      error: "Erreur interne: Format de données d'accès invalide.",
      errorType: 'general'
    };
  }
  
  return {
    isValid: true,
    userId: accessItem.user_id
  };
};
