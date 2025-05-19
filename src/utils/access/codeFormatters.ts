
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
      // Nouvelle approche plus directe: vérifier explicitement si l'ID est un UUID complet
      if (idPart.length >= 8) {
        console.log("Tentative avec UUID partiel:", idPart);
        // Méthode 1: Récupérer directement le profil par l'ID si c'est un UUID complet
        const { data: profileById, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('id', idPart.toLowerCase());
          
        if (!profileError && profileById && profileById.length > 0) {
          console.log("Profil trouvé directement par ID:", profileById[0]);
          return profileById.map(profile => ({
            user_id: profile.id
          }));
        }
          
        // Méthode 2: Vérifier si l'ID partiel correspond au début d'un UUID
        const { data: allProfiles, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name');
        
        if (!error && allProfiles && allProfiles.length > 0) {
          const idPartLower = idPart.toLowerCase();
          
          // Vérifier les correspondances exactes d'ID
          const matchingProfiles = allProfiles.filter(profile => 
            profile.id.toLowerCase() === idPartLower
          );
          
          if (matchingProfiles.length > 0) {
            console.log("Profil trouvé par correspondance exacte d'ID:", matchingProfiles[0]);
            return matchingProfiles.map(profile => ({
              user_id: profile.id
            }));
          }
          
          // Vérifier les correspondances partielles d'ID (début d'ID)
          const partialMatches = allProfiles.filter(profile => 
            profile.id.toLowerCase().startsWith(idPartLower)
          );
          
          if (partialMatches.length > 0) {
            console.log("Profil trouvé par début d'ID:", partialMatches[0]);
            return partialMatches.map(profile => ({
              user_id: profile.id
            }));
          }
          
          // Vérifier les correspondances partielles d'ID (n'importe où dans l'ID)
          const looseMatches = allProfiles.filter(profile => 
            profile.id.toLowerCase().includes(idPartLower)
          );
          
          if (looseMatches.length > 0) {
            console.log("Profil trouvé par correspondance partielle d'ID:", looseMatches[0]);
            return looseMatches.map(profile => ({
              user_id: profile.id
            }));
          }
        }
      }
      
      // Approche 3: Vérifier les codes médicaux dans profiles
      console.log("Vérification alternative dans les codes médicaux...");
      const { data: medicalMatches, error: medicalError } = await supabase
        .from('profiles')
        .select('id, medical_access_code')
        .ilike('medical_access_code', idPart);
        
      if (!medicalError && medicalMatches && medicalMatches.length > 0) {
        console.log("Profil trouvé via code médical:", medicalMatches[0]);
        return medicalMatches.map(profile => ({
          user_id: profile.id
        }));
      }
      
      // Approche 4: Vérifier les codes d'accès dans document_access_codes
      console.log("Vérification dans document_access_codes...");
      const { data: docAccessCodes, error: docAccessError } = await supabase
        .from('document_access_codes')
        .select('user_id')
        .eq('access_code', idPart);
      
      if (!docAccessError && docAccessCodes && docAccessCodes.length > 0) {
        console.log("Code trouvé dans document_access_codes:", docAccessCodes[0]);
        return docAccessCodes;
      }

      // Recherche avec UUID partiel dans document_access_codes
      console.log("Recherche avancée dans document_access_codes avec correspondance partielle...");
      const { data: allAccessCodes, error: allCodesError } = await supabase
        .from('document_access_codes')
        .select('user_id, access_code');
        
      if (!allCodesError && allAccessCodes && allAccessCodes.length > 0) {
        const idPartLower = idPart.toLowerCase();
        const matchingCodes = allAccessCodes.filter(code => 
          code.access_code.toLowerCase().includes(idPartLower)
        );
        
        if (matchingCodes.length > 0) {
          console.log("Code trouvé via correspondance partielle:", matchingCodes[0]);
          return matchingCodes;
        }
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
