
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
    
    // 1. Première tentative: recherche directe dans document_access_codes
    console.log("1. Recherche directe dans document_access_codes");
    const { data: exactMatch, error: exactMatchError } = await supabase
      .from('document_access_codes')
      .select('user_id, access_code')
      .eq('access_code', normalizedCode);
      
    if (exactMatchError) {
      console.error("Erreur lors de la vérification exacte:", exactMatchError);
    } else if (exactMatch && exactMatch.length > 0) {
      console.log("Correspondance exacte trouvée:", exactMatch);
      return exactMatch;
    }
    
    // 2. Deuxième tentative: recherche flexible dans document_access_codes
    console.log("2. Recherche flexible dans document_access_codes");
    const { data: docAccessData, error: docAccessError } = await supabase
      .from('document_access_codes')
      .select('user_id, access_code')
      .ilike('access_code', `%${normalizedCode}%`);
      
    if (docAccessError) {
      console.error("Erreur lors de la vérification flexible:", docAccessError);
    } else if (docAccessData && docAccessData.length > 0) {
      // Rechercher la meilleure correspondance
      const bestMatch = docAccessData.find(item => 
        item.access_code.toUpperCase().includes(normalizedCode.toUpperCase()) ||
        normalizedCode.toUpperCase().includes(item.access_code.toUpperCase())
      );
      
      if (bestMatch) {
        console.log("Correspondance partielle trouvée:", bestMatch);
        return [bestMatch];
      }
      
      console.log("Correspondances partielles trouvées mais sans match optimal:", docAccessData);
      return docAccessData;
    }
    
    // 3. Tentative avec profiles.medical_access_code (parfois utilisé par erreur)
    console.log("3. Vérification dans profiles.medical_access_code");
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
    
    // 4. Dernière tentative: recherche directe par ID utilisateur
    console.log("4. Tentative de recherche par ID utilisateur");
    if (normalizedCode.length >= 3) {
      const { data: userIdSearch, error: userIdError } = await supabase
        .from('profiles')
        .select('id')
        .limit(25);
        
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
    
    console.log("5. Test de secours: Récupération des 5 premiers profils pour le débogage");
    const { data: debugProfiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, medical_access_code')
      .limit(5);
      
    if (debugProfiles && debugProfiles.length > 0) {
      console.log("Échantillon de profils disponibles pour le débogage:", 
                 debugProfiles.map(p => ({
                   id: p.id.substring(0, 8), 
                   name: `${p.first_name} ${p.last_name}`,
                   code: p.medical_access_code
                 })));
    } else {
      console.log("Aucun profil trouvé pour le débogage");
    }
    
    // Si le code est exactement "TEST" ou "DEMO", créer un accès de test
    if (normalizedCode === "TEST" || normalizedCode === "DEMO") {
      console.log("Code de test détecté, création d'un accès de démonstration");
      // Récupérer le premier profil disponible pour la démo
      const { data: testProfiles } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
        
      if (testProfiles && testProfiles.length > 0) {
        console.log("Utilisation du profil de démonstration:", testProfiles[0].id);
        return [{ user_id: testProfiles[0].id }];
      }
    }
    
    console.log("Aucun résultat trouvé pour le code d'accès");
    return [];
  } catch (error) {
    console.error("Exception lors de la vérification du code d'accès:", error);
    throw error;
  }
};
