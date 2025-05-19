
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
      // Approche 1: Rechercher par correspondance exacte du début de l'ID (sans ilike)
      // Convertir en minuscules pour la comparaison (plus sûr pour les IDs)
      const idPartLower = idPart.toLowerCase();
      console.log(`Recherche de profil avec ID commençant par: ${idPartLower}`);
      
      // Récupérer tous les profils pour filtrer manuellement par ID (plus sûr que ilike sur UUID)
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, medical_access_code, first_name, last_name')
        .limit(100); // Limite raisonnable
        
      if (profilesError) {
        console.error("Erreur lors de la récupération des profils:", profilesError);
      } else if (allProfiles && allProfiles.length > 0) {
        // Filtrer manuellement les profils dont l'ID commence par idPart
        const matchingProfiles = allProfiles.filter(profile => 
          profile.id.toLowerCase().startsWith(idPartLower)
        );
        
        if (matchingProfiles.length > 0) {
          console.log("Profil trouvé via correspondance d'ID par préfixe:", matchingProfiles[0]);
          // Transformer pour correspondre au format attendu avec user_id
          return matchingProfiles.map(profile => ({
            user_id: profile.id
          }));
        }
      }
      
      // Approche 2: Si aucun profil trouvé par ID, chercher par medical_access_code
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

      // Approche 3: Si c'est un UUID complet, recherche directe
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
      
      // Si tout échoue, on pourrait chercher directement par l'ID utilisateur
      console.log("Tentative directe avec ID utilisateur:", idPart);
      try {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(idPart);
        
        if (!userError && userData && userData.user) {
          console.log("Utilisateur trouvé directement via auth.admin:", userData.user);
          return [{
            user_id: userData.user.id
          }];
        }
      } catch (authErr) {
        console.error("Erreur lors de la recherche directe de l'utilisateur:", authErr);
        // On continue normalement, cette erreur n'est pas bloquante
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
