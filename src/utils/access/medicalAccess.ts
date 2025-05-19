
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
    const specialResult = await handleSpecialCodes(accessCode);
    if (specialResult) {
      return specialResult;
    }
    
    // Normalisation du code (suppression des espaces, tirets, et uniformisation en majuscules)
    const normalizedCode = normalizeAccessCode(accessCode);
    console.log(`Code d'accès médical normalisé: "${normalizedCode}"`);
    
    // Essayer avec le code exact
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('medical_access_code', normalizedCode);
    
    if (error) {
      console.error("Erreur lors de la vérification du code d'accès médical:", error);
      throw error;
    }
    
    console.log(`Résultat de la vérification médicale:`, data);
    return data || [];
  } catch (error) {
    console.error("Exception lors de la vérification du code d'accès médical:", error);
    throw error;
  }
};
