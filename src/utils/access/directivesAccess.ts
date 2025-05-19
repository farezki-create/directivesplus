
import { supabase } from "@/integrations/supabase/client";
import { handleSpecialCodes, normalizeAccessCode, AccessData } from "./codeFormatters";

// Fonctions utilitaires pour les interactions avec la base de données
export const checkDirectivesAccessCode = async (accessCode: string) => {
  if (!accessCode) {
    console.error("Code d'accès vide");
    return [];
  }
  
  console.log(`Vérification du code d'accès: "${accessCode}"`);
  
  try {
    // Vérifier d'abord si c'est un code spécial (DM-xxxx)
    const specialResult = await handleSpecialCodes(accessCode);
    if (specialResult) {
      console.log("Résultat spécial trouvé pour directives:", specialResult);
      return specialResult;
    }
    
    // Normalisation du code (suppression des espaces, tirets, et uniformisation en majuscules)
    const normalizedCode = normalizeAccessCode(accessCode);
    console.log(`Code d'accès normalisé: "${normalizedCode}"`);
    
    // Essayer avec le code exact
    let { data, error } = await supabase
      .from('document_access_codes')
      .select('user_id')
      .ilike('access_code', normalizedCode);
      
    if (error) {
      console.error("Erreur lors de la vérification du code d'accès:", error);
      throw error;
    }
    
    // Si rien n'est trouvé avec le code exact, vérifier le code médical dans profiles
    // (pour permettre l'accès croisé)
    if (!data || data.length === 0) {
      console.log("Code d'accès non trouvé dans document_access_codes, vérification dans profiles...");
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, medical_access_code')
        .ilike('medical_access_code', normalizedCode);
        
      if (profileError) {
        console.error("Erreur lors de la vérification du code médical:", profileError);
        throw profileError;
      }
      
      if (profileData && profileData.length > 0) {
        console.log("Code trouvé dans profiles:", profileData);
        // Transformer les données pour correspondre au format attendu
        data = profileData.map(profile => ({
          user_id: profile.id
        }));
      }
    }
    
    console.log(`Résultat de la vérification:`, data);
    return data || [];
  } catch (error) {
    console.error("Exception lors de la vérification du code d'accès:", error);
    throw error;
  }
};
