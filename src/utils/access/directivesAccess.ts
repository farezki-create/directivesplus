
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
    if (accessCode.toUpperCase().startsWith('DM')) {
      console.log("Format spécial DM détecté, traitement spécifique...");
      const specialResult = await handleSpecialCodes(accessCode);
      if (specialResult && specialResult.length > 0) {
        console.log("Résultat spécial trouvé pour directives:", specialResult);
        return specialResult;
      }
    }
    
    // Normalisation du code (suppression des espaces, tirets, et uniformisation en majuscules)
    const normalizedCode = normalizeAccessCode(accessCode);
    console.log(`Code d'accès normalisé: "${normalizedCode}"`);
    
    // Essayer avec le code exact
    let { data, error } = await supabase
      .from('document_access_codes')
      .select('user_id')
      .eq('access_code', normalizedCode);
      
    if (error) {
      console.error("Erreur lors de la vérification du code d'accès:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      // Essayer avec la recherche insensible à la casse
      const { data: caseInsensitiveData, error: caseError } = await supabase
        .from('document_access_codes')
        .select('user_id')
        .ilike('access_code', normalizedCode);
        
      if (!caseError && caseInsensitiveData && caseInsensitiveData.length > 0) {
        data = caseInsensitiveData;
      }
    }
    
    // Si rien n'est trouvé avec le code exact, vérifier le code médical dans profiles
    if (!data || data.length === 0) {
      console.log("Code d'accès non trouvé dans document_access_codes, vérification dans profiles...");
      
      // D'abord avec correspondance exacte
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, medical_access_code')
        .eq('medical_access_code', normalizedCode);
        
      if (!profileError && profileData && profileData.length > 0) {
        console.log("Code trouvé dans profiles avec correspondance exacte:", profileData);
        return profileData.map(profile => ({
          user_id: profile.id
        }));
      }
      
      // Ensuite avec correspondance insensible à la casse
      const { data: profileDataIlike, error: profileErrorIlike } = await supabase
        .from('profiles')
        .select('id, medical_access_code')
        .ilike('medical_access_code', normalizedCode);
        
      if (!profileErrorIlike && profileDataIlike && profileDataIlike.length > 0) {
        console.log("Code trouvé dans profiles avec correspondance insensible à la casse:", profileDataIlike);
        return profileDataIlike.map(profile => ({
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
