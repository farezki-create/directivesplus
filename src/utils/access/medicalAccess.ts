
import { supabase } from "@/integrations/supabase/client";
import { handleSpecialCodes, normalizeAccessCode } from "./codeFormatters";

export const checkMedicalAccessCode = async (accessCode: string) => {
  if (!accessCode) {
    console.error("Code d'accès médical vide");
    return [];
  }
  
  console.log(`Vérification du code d'accès médical: "${accessCode}"`);
  
  try {
    // Vérifier d'abord si c'est un code spécial (DM-xxxx)
    if (accessCode.toUpperCase().startsWith('DM')) {
      console.log("Format spécial DM détecté pour accès médical, traitement spécifique...");
      const specialResult = await handleSpecialCodes(accessCode);
      if (specialResult && specialResult.length > 0) {
        console.log("Résultat spécial trouvé pour accès médical:", specialResult);
        return specialResult;
      } else {
        console.log("Aucun résultat spécial trouvé pour accès médical");
      }
    }
    
    // Si ce n'est pas un code spécial ou aucun résultat trouvé, continuer avec la procédure normale
    const normalizedCode = normalizeAccessCode(accessCode);
    console.log(`Code d'accès médical normalisé: "${normalizedCode}"`);
    
    // Recherche dans profiles avec medical_access_code
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .or(`medical_access_code.eq.${normalizedCode},medical_access_code.ilike.%${normalizedCode}%`);
    
    if (profileError) {
      console.error("Erreur lors de la vérification du code d'accès médical:", profileError);
      throw profileError;
    }
    
    console.log(`Résultat de la vérification médicale:`, profileData);
    return profileData || [];
  } catch (error) {
    console.error("Exception lors de la vérification du code d'accès médical:", error);
    throw error;
  }
};
