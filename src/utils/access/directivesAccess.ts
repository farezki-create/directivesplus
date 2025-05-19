
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
    // Vérifier si c'est un code spécial (DM-xxxx)
    if (accessCode.toUpperCase().trim().startsWith('DM')) {
      console.log("Format spécial DM détecté, traitement spécifique...");
      const specialResult = await handleSpecialCodes(accessCode);
      if (specialResult && specialResult.length > 0) {
        console.log("Résultat spécial trouvé pour directives:", specialResult);
        return specialResult;
      } else {
        console.log("Aucun résultat spécial trouvé pour directives");
        // Si pas de résultat, essayer avec le code normalisé comme fallback
      }
    }
    
    // Si ce n'est pas un code spécial ou aucun résultat trouvé, continuer avec la procédure normale
    const normalizedCode = normalizeAccessCode(accessCode);
    console.log(`Code d'accès normalisé: "${normalizedCode}"`);
    
    // Essayer avec le code dans document_access_codes - Recherche exacte et avec LIKE
    const { data: docAccessData, error: docAccessError } = await supabase
      .from('document_access_codes')
      .select('user_id')
      .or(`access_code.eq.${normalizedCode},access_code.ilike.%${normalizedCode}%`);
      
    if (docAccessError) {
      console.error("Erreur lors de la vérification dans document_access_codes:", docAccessError);
    } else if (docAccessData && docAccessData.length > 0) {
      console.log("Code trouvé dans document_access_codes:", docAccessData);
      return docAccessData;
    } else {
      console.log("Code non trouvé dans document_access_codes, vérification dans profiles...");
    }
    
    // Si rien n'est trouvé, vérifier le code médical dans profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, medical_access_code')
      .or(`medical_access_code.eq.${normalizedCode},medical_access_code.ilike.%${normalizedCode}%`);
      
    if (profileError) {
      console.error("Erreur lors de la vérification dans profiles:", profileError);
    } else if (profileData && profileData.length > 0) {
      console.log("Code trouvé dans profiles:", profileData);
      return profileData.map(profile => ({
        user_id: profile.id
      }));
    }
    
    console.log("Aucun résultat trouvé pour le code d'accès normalisé");
    return [];
  } catch (error) {
    console.error("Exception lors de la vérification du code d'accès:", error);
    throw error;
  }
};
