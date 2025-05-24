
import { supabase } from "@/integrations/supabase/client";

export const validateInstitutionCodes = async (institutionCode: string) => {
  console.log("=== VALIDATION CODES INSTITUTION ===");
  console.log("Code institution à valider:", institutionCode);
  
  try {
    const { data: validCodes, error } = await supabase
      .from('directives')
      .select('id, user_id, institution_code, institution_code_expires_at')
      .eq('institution_code', institutionCode)
      .gt('institution_code_expires_at', new Date().toISOString());

    console.log("Résultat requête codes institution:", { validCodes, error });

    if (error) {
      console.error("Erreur vérification codes institution:", error);
      throw new Error("Erreur lors de la vérification du code d'accès institution.");
    }

    if (!validCodes || validCodes.length === 0) {
      console.log("Aucun code institution valide trouvé pour:", institutionCode);
      
      // Vérifier s'il y a des codes en général
      const { data: allCodes } = await supabase
        .from('directives')
        .select('institution_code')
        .not('institution_code', 'is', null)
        .limit(1);
      
      if (!allCodes || allCodes.length === 0) {
        throw new Error("Aucun code d'accès institution n'existe dans la base de données. " +
                       "Le patient doit d'abord créer une directive et générer un code d'accès institution.");
      }
      
      throw new Error("Code d'accès institution invalide ou expiré. " +
                     "Vérifiez que le code est correct et qu'il n'a pas expiré.");
    }

    console.log("Codes institution valides trouvés:", validCodes);
    return validCodes;
  } catch (error) {
    console.error("Exception validation codes institution:", error);
    throw error;
  }
};
