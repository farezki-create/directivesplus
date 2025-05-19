
import { supabase } from "@/integrations/supabase/client";

// Normalisation du code d'accès pour supporter différents formats (avec ou sans tiret)
export const normalizeAccessCode = (code: string): string => {
  // Supprimer les espaces et convertir en majuscules
  const trimmed = code.trim().toUpperCase();
  
  // Enlever les tirets ou autres caractères spéciaux si présents
  // Note: On conserve seulement les caractères alphanumériques
  return trimmed.replace(/[^A-Z0-9]/g, '');
};

// Type définition pour les résultats spéciaux (format DM-)
export type SpecialAccessData = {
  user_id: string;
};

// Type définition pour les résultats standard
export type StandardAccessData = {
  id: string;
  [key: string]: any;
};

// Union type pour les deux formats possibles
export type AccessData = SpecialAccessData | StandardAccessData;

// Logique spéciale pour les codes avec préfixe "DM-"
export const handleSpecialCodes = async (code: string) => {
  // Si le code commence par "DM-" ou "DM", c'est probablement un code spécial pour accès médical
  const upperCode = code.trim().toUpperCase();
  if (upperCode.startsWith('DM-') || upperCode.startsWith('DM')) {
    // Extraire l'ID potentiel (après le préfixe)
    const idPart = upperCode.replace(/^DM-?/i, '');
    console.log(`Code spécial détecté, extraction de l'ID: ${idPart}`);
    
    try {
      // Approche 1: Utiliser l'ID comme code d'accès médical directement
      console.log("Tentative directe avec code d'accès médical:", idPart);
      const { data: medicalMatches, error: medicalError } = await supabase
        .from('profiles')
        .select('id, medical_access_code')
        .eq('medical_access_code', idPart);
      
      if (!medicalError && medicalMatches && medicalMatches.length > 0) {
        console.log("Profil trouvé via correspondance exacte de code médical:", medicalMatches[0]);
        return medicalMatches.map(profile => ({
          user_id: profile.id
        }));
      }
      
      // Approche 2: Chercher par code médical partiel
      const { data: partialMatches, error: partialError } = await supabase
        .from('profiles')
        .select('id, medical_access_code')
        .ilike('medical_access_code', `%${idPart}%`);
        
      if (!partialError && partialMatches && partialMatches.length > 0) {
        console.log("Profil trouvé via correspondance partielle de code médical:", partialMatches[0]);
        return partialMatches.map(profile => ({
          user_id: profile.id
        }));
      }
      
      // Approche 3: Récupérer tous les profils et chercher des correspondances manuellement
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, medical_access_code, first_name, last_name');
      
      if (!profilesError && allProfiles && allProfiles.length > 0) {
        // Vérifier si l'ID correspond à un début d'UUID de profil
        const idPartLower = idPart.toLowerCase();
        const matchingProfiles = allProfiles.filter(profile => 
          profile.id.toLowerCase().startsWith(idPartLower)
        );
        
        if (matchingProfiles.length > 0) {
          console.log("Profil trouvé via correspondance de début d'ID:", matchingProfiles[0]);
          return matchingProfiles.map(profile => ({
            user_id: profile.id
          }));
        }
        
        // Vérifier si l'ID est un sous-ensemble d'un UUID de profil (moins strict)
        const looseMatches = allProfiles.filter(profile => 
          profile.id.toLowerCase().includes(idPartLower)
        );
        
        if (looseMatches.length > 0) {
          console.log("Profil trouvé via correspondance partielle d'ID:", looseMatches[0]);
          return looseMatches.map(profile => ({
            user_id: profile.id
          }));
        }
      }
      
      // Approche 4: Vérifier les codes d'accès dans document_access_codes
      const { data: docAccessCodes, error: docAccessError } = await supabase
        .from('document_access_codes')
        .select('user_id')
        .eq('access_code', idPart);
      
      if (!docAccessError && docAccessCodes && docAccessCodes.length > 0) {
        console.log("Code trouvé dans document_access_codes:", docAccessCodes[0]);
        return docAccessCodes.map(code => ({
          user_id: code.user_id
        }));
      }
      
      // Si on arrive ici, aucune correspondance n'a été trouvée
      console.log("Aucun profil ou code d'accès trouvé pour:", idPart);
      return null;
    } catch (err) {
      console.error("Exception dans handleSpecialCodes:", err);
      return null;
    }
  }
  
  return null; // Pas un code spécial ou pas trouvé
};
