
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
    
    // Essayer avec le code dans document_access_codes - Recherche plus flexible
    const { data: docAccessData, error: docAccessError } = await supabase
      .from('document_access_codes')
      .select('user_id, access_code')
      .ilike('access_code', `%${normalizedCode}%`);
      
    if (docAccessError) {
      console.error("Erreur lors de la vérification dans document_access_codes:", docAccessError);
    } else if (docAccessData && docAccessData.length > 0) {
      // Rechercher la meilleure correspondance
      const exactMatch = docAccessData.find(item => 
        item.access_code.toUpperCase() === normalizedCode.toUpperCase());
      
      if (exactMatch) {
        console.log("Correspondance exacte trouvée:", exactMatch);
        return [exactMatch];
      }
      
      console.log("Correspondances partielles trouvées dans document_access_codes:", docAccessData);
      return docAccessData;
    } else {
      console.log("Code non trouvé dans document_access_codes, vérification dans profiles...");
    }
    
    // Si rien n'est trouvé, vérifier le code médical dans profiles qui pourrait être utilisé par erreur
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, medical_access_code')
      .ilike('medical_access_code', `%${normalizedCode}%`);
      
    if (profileError) {
      console.error("Erreur lors de la vérification dans profiles:", profileError);
    } else if (profileData && profileData.length > 0) {
      console.log("Code trouvé dans profiles (medical_access_code):", profileData);
      return profileData.map(profile => ({
        user_id: profile.id
      }));
    }
    
    // Dernière tentative: recherche directe par ID utilisateur (pour faciliter les tests)
    if (normalizedCode.length >= 4) {
      const { data: userIdSearch, error: userIdError } = await supabase
        .from('profiles')
        .select('id')
        .limit(20);
        
      if (!userIdError && userIdSearch && userIdSearch.length > 0) {
        // Rechercher des correspondances partielles
        const matchingUsers = userIdSearch.filter(user => 
          user.id.toLowerCase().includes(normalizedCode.toLowerCase()) ||
          normalizedCode.toLowerCase().includes(user.id.substring(0, 8).toLowerCase())
        );
        
        if (matchingUsers.length > 0) {
          console.log("Utilisateurs trouvés par ID partiel:", matchingUsers);
          return matchingUsers.map(user => ({ user_id: user.id }));
        }
      }
    }
    
    console.log("Aucun résultat trouvé pour le code d'accès normalisé");
    return [];
  } catch (error) {
    console.error("Exception lors de la vérification du code d'accès:", error);
    throw error;
  }
};
