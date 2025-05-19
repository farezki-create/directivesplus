
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

// Fonction simplifiée pour traiter les codes spéciaux DM-
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
    // Étape 1: Vérifier d'abord si l'ID est un UUID valide et complet
    if (idPart.length >= 8) {
      // Méthode 1: Recherche directe dans la table profiles par ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', idPart.toLowerCase());
      
      if (!profileError && profileData && profileData.length > 0) {
        console.log("Profil trouvé par ID exact:", profileData);
        return profileData.map(profile => ({ user_id: profile.id }));
      }
    }
    
    // Étape 2: Recherche de correspondances partielles d'ID
    if (idPart.length >= 4) {
      const { data: allProfiles, error } = await supabase
        .from('profiles')
        .select('id');
      
      if (!error && allProfiles && allProfiles.length > 0) {
        const idPartLower = idPart.toLowerCase();
        
        // Test de correspondances partielles (début de l'ID)
        const matchingProfiles = allProfiles.filter(profile => 
          profile.id.toLowerCase().startsWith(idPartLower)
        );
        
        if (matchingProfiles.length > 0) {
          console.log("Profil trouvé par correspondance partielle d'ID:", matchingProfiles);
          return matchingProfiles.map(profile => ({ user_id: profile.id }));
        }
        
        // Test de correspondances partielles (n'importe où dans l'ID)
        const looseMatches = allProfiles.filter(profile => 
          profile.id.toLowerCase().includes(idPartLower)
        );
        
        if (looseMatches.length > 0) {
          console.log("Profil trouvé par correspondance partielle dans l'ID:", looseMatches);
          return looseMatches.map(profile => ({ user_id: profile.id }));
        }
      }
    }
    
    // Étape 3: Vérification dans medical_access_code
    const { data: medicalMatches, error: medicalError } = await supabase
      .from('profiles')
      .select('id, medical_access_code')
      .like('medical_access_code', `%${idPart}%`);
      
    if (!medicalError && medicalMatches && medicalMatches.length > 0) {
      console.log("Profil trouvé via code médical:", medicalMatches);
      return medicalMatches.map(profile => ({ user_id: profile.id }));
    }
    
    // Étape 4: Vérification dans document_access_codes
    const { data: docAccessCodes, error: docAccessError } = await supabase
      .from('document_access_codes')
      .select('user_id, access_code')
      .like('access_code', `%${idPart}%`);
    
    if (!docAccessError && docAccessCodes && docAccessCodes.length > 0) {
      console.log("Code trouvé dans document_access_codes:", docAccessCodes);
      return docAccessCodes;
    }

    console.log("Aucune correspondance trouvée pour:", idPart);
    return null;
  } catch (err) {
    console.error("Exception dans handleSpecialCodes:", err);
    return null;
  }
};
