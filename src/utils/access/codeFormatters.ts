
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
      // CORRECTION: Au lieu de chercher par l'ID directement qui peut causer des erreurs de format UUID,
      // Essayons d'abord de retrouver le profil par correspondance partielle avec l'ID
      const fullUUID = idPart.length < 36 ? `${idPart}%` : idPart;
      
      console.log(`Recherche de profil avec ID commençant par: ${fullUUID}`);
      const { data: profilesByIdMatch, error: idMatchError } = await supabase
        .from('profiles')
        .select('id, medical_access_code, first_name, last_name')
        .ilike('id', fullUUID)
        .limit(1);
        
      if (idMatchError) {
        console.error("Erreur lors de la recherche par ID partiel:", idMatchError);
      } else if (profilesByIdMatch && profilesByIdMatch.length > 0) {
        console.log("Profil trouvé via correspondance d'ID partiel:", profilesByIdMatch[0]);
        // Transformer pour correspondre au format attendu avec user_id
        return profilesByIdMatch.map(profile => ({
          user_id: profile.id
        }));
      }
      
      // Si aucune correspondance par ID partiel, essayons avec le medical_access_code
      console.log("Tentative avec code d'accès médical:", idPart);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, medical_access_code, first_name, last_name')
        .or(`medical_access_code.ilike.%${idPart}%,medical_access_code.eq.${idPart}`);
        
      if (error) {
        console.error("Erreur lors de la vérification du code spécial (via medical_access_code):", error);
        return null;
      }
      
      if (data && data.length > 0) {
        console.log("Profil trouvé via code médical:", data[0]);
        // Transformer les données pour correspondre au format attendu
        return data.map(profile => ({
          user_id: profile.id
        }));
      }

      // Dernière tentative: chercher si l'ID complet existe
      // Cette approche est utilisée uniquement si les deux premières ont échoué
      if (idPart.length === 36) { // Si c'est potentiellement un UUID complet
        console.log("Tentative avec UUID complet:", idPart);
        const { data: exactMatch, error: exactError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', idPart);
          
        if (!exactError && exactMatch && exactMatch.length > 0) {
          console.log("Profil trouvé via UUID exact:", exactMatch[0]);
          return exactMatch.map(profile => ({
            user_id: profile.id
          }));
        }
      }
      
      console.log("Aucun profil trouvé pour ce code spécial");
      return null;
    } catch (err) {
      console.error("Exception dans handleSpecialCodes:", err);
      return null;
    }
  }
  
  return null; // Pas un code spécial ou pas trouvé
};
