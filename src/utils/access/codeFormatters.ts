
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
      // Au lieu de chercher directement par ID, cherchons dans le medical_access_code
      // Cette approche est plus sûre car elle évite les problèmes de format UUID
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`medical_access_code.ilike.%${idPart}%,medical_access_code.ilike.${idPart}`);
        
      if (error) {
        console.error("Erreur lors de la vérification du code spécial (via medical_access_code):", error);
        return [];
      }
      
      if (data && data.length > 0) {
        console.log("Profil trouvé via code médical spécial:", data);
        return data;
      }
      
      // Si on n'a rien trouvé, essayons avec l'ID directement au cas où
      console.log("Tentative alternative avec l'ID complet:", idPart);
      const { data: idData, error: idError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', idPart);
        
      if (idError) {
        console.error("Erreur lors de la vérification de l'ID:", idError);
        return [];
      }
      
      if (idData && idData.length > 0) {
        console.log("ID utilisateur trouvé directement:", idData);
        // Transformer pour correspondre au format attendu
        return idData.map(profile => ({
          user_id: profile.id
        }));
      }
    } catch (err) {
      console.error("Exception dans handleSpecialCodes:", err);
      return [];
    }
  }
  
  return null; // Pas un code spécial ou pas trouvé
};
