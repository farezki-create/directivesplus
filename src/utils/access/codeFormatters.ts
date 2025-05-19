
import { supabase } from "@/integrations/supabase/client";

// Normalisation du code d'accès pour supporter différents formats (avec ou sans tiret)
export const normalizeAccessCode = (code: string): string => {
  // Supprimer les espaces et convertir en majuscules
  const trimmed = code.trim().toUpperCase();
  
  // Enlever les tirets ou autres caractères spéciaux si présents
  // Note: On conserve seulement les caractères alphanumériques
  return trimmed.replace(/[^A-Z0-9]/g, '');
};

// Type définition pour les résultats avec user_id
export type AccessData = {
  user_id: string;
  [key: string]: any;
};

// Fonction pour générer un code d'accès alphnumérique standard
export const generateStandardAccessCode = (length: number = 8): string => {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclusion de I et O pour éviter la confusion
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }
  
  return result;
};

// Fonction pour enregistrer un nouveau code d'accès pour un utilisateur
export const createNewAccessCode = async (userId: string, isForMedical: boolean = false): Promise<string | null> => {
  try {
    // Générer un nouveau code standardisé
    const newCode = generateStandardAccessCode(10);
    console.log(`Génération d'un nouveau code d'accès pour l'utilisateur ${userId}: ${newCode}`);
    
    if (isForMedical) {
      // Mettre à jour le profil avec le nouveau code d'accès médical
      const { error } = await supabase
        .from('profiles')
        .update({ medical_access_code: newCode })
        .eq('id', userId);
        
      if (error) {
        console.error("Erreur lors de la création du code d'accès médical:", error);
        return null;
      }
    } else {
      // Créer un code d'accès pour les directives
      const { error } = await supabase
        .from('document_access_codes')
        .insert({
          user_id: userId,
          access_code: newCode,
          is_full_access: true
        });
        
      if (error) {
        console.error("Erreur lors de la création du code d'accès directives:", error);
        return null;
      }
    }
    
    return newCode;
  } catch (err) {
    console.error("Exception lors de la création du code d'accès:", err);
    return null;
  }
};

// Fonction améliorée pour traiter les codes spéciaux DM-
export const handleSpecialCodes = async (code: string): Promise<AccessData[] | null> => {
  const upperCode = code.trim().toUpperCase();
  let idPart = '';
  
  console.log("Traitement du code spécial:", upperCode);
  
  // Extraire la partie ID après le préfixe DM
  if (upperCode.startsWith('DM-')) {
    idPart = upperCode.substring(3);
  } else if (upperCode.startsWith('DM')) {
    idPart = upperCode.substring(2);
  } else {
    return null;
  }
  
  console.log("Partie ID extraite:", idPart);
  
  try {
    // Recherche directe dans les codes d'accès des documents
    const { data: docAccessCodes, error: docAccessError } = await supabase
      .from('document_access_codes')
      .select('user_id, access_code')
      .ilike('access_code', `%${idPart}%`);
    
    if (!docAccessError && docAccessCodes && docAccessCodes.length > 0) {
      console.log("Code trouvé dans document_access_codes:", docAccessCodes);
      return docAccessCodes;
    }
    
    // Recherche dans profiles.medical_access_code
    const { data: medicalMatches, error: medicalError } = await supabase
      .from('profiles')
      .select('id, medical_access_code')
      .ilike('medical_access_code', `%${idPart}%`);
      
    if (!medicalError && medicalMatches && medicalMatches.length > 0) {
      console.log("Profil trouvé via code médical:", medicalMatches);
      return medicalMatches.map(profile => ({ user_id: profile.id }));
    }
    
    // Recherche par correspondance partielle d'ID (procéder avec prudence)
    console.log("Tentative de correspondance partielle d'ID avec:", idPart);
    
    // Récupérer tous les profils
    const { data: allProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(100);  // Limiter pour éviter une surcharge
      
    if (profileError) {
      console.error("Erreur lors de la récupération des profils:", profileError);
      return null;
    }
    
    // Vérifier les correspondances partielles d'ID
    if (allProfiles && allProfiles.length > 0) {
      const idPartLower = idPart.toLowerCase();
      
      // Test de correspondances partielles (début de l'ID)
      const matchingProfiles = allProfiles.filter(profile => 
        profile.id.toLowerCase().includes(idPartLower)
      );
      
      if (matchingProfiles.length > 0) {
        console.log("Profils trouvés par correspondance partielle d'ID:", matchingProfiles);
        return matchingProfiles.map(profile => ({ user_id: profile.id }));
      }
    }

    // Si aucune correspondance n'est trouvée, tenter une dernière approche
    // Vérifier si le code ressemble à un UUID valide (même partiel)
    if (idPart.length >= 5) {
      // Essayer de construire un UUID complet à partir du fragment
      // Par exemple, compléter avec des zéros
      const potentialUuid = idPart.padEnd(36, '0').replace(/(.{8})(.{4})(.{4})(.{4})(.+)/, '$1-$2-$3-$4-$5');
      
      console.log("Tentative avec UUID construit:", potentialUuid);
      
      // Vérifier si cet UUID correspond à un utilisateur
      try {
        const { data: userById, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', potentialUuid);
          
        if (!userError && userById && userById.length > 0) {
          console.log("Utilisateur trouvé avec UUID construit:", userById);
          return userById.map(user => ({ user_id: user.id }));
        }
      } catch (uuidError) {
        console.error("Erreur lors de la tentative avec UUID construit:", uuidError);
      }
    }
    
    console.log("Aucune correspondance trouvée pour le code spécial:", idPart);
    return null;
  } catch (err) {
    console.error("Exception dans handleSpecialCodes:", err);
    return null;
  }
};
