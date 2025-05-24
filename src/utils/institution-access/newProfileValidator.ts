
import { supabase } from "@/integrations/supabase/client";

export const validateInstitutionCodeWithRPC = async (
  lastName: string,
  firstName: string, 
  birthDate: string,
  institutionCode: string
) => {
  console.log("=== VALIDATION AVEC RPC ===");
  console.log("Données d'entrée:", { lastName, firstName, birthDate, institutionCode });
  
  try {
    // Utiliser la fonction de debug étape par étape
    const { data: debugData, error: debugError } = await supabase.rpc("debug_institution_access_step_by_step" as any, {
      input_last_name: lastName.trim(),
      input_first_name: firstName.trim(),
      input_birth_date: birthDate,
      input_shared_code: institutionCode.trim()
    });

    console.log("Résultat debug RPC:", { debugData, debugError });

    if (debugError) {
      console.error("Erreur debug RPC:", debugError);
      throw new Error("Erreur lors de la vérification debug du code d'accès institution.");
    }

    // Afficher les résultats de debug
    if (debugData && Array.isArray(debugData)) {
      debugData.forEach((step: any) => {
        console.log(`${step.step_name}: ${step.found_count} résultat(s) - ${step.details}`);
      });
    }

    // Essayer la fonction RPC principale
    const { data, error } = await supabase.rpc("get_patient_directives_by_institution_access" as any, {
      input_last_name: lastName.trim(),
      input_first_name: firstName.trim(),
      input_birth_date: birthDate,
      input_shared_code: institutionCode.trim()
    });

    console.log("Résultat RPC directives:", { data, error });

    if (error) {
      console.error("Erreur RPC:", error);
      throw new Error("Erreur lors de la vérification du code d'accès institution.");
    }

    // Vérification que data est un tableau
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("Aucun profil trouvé avec la fonction RPC, utilisation du fallback");
      throw new Error("Code d'accès institution invalide ou informations patient incorrectes.");
    }

    console.log("Profils trouvés via RPC:", data);
    
    // Transformer pour correspondre au format attendu
    return data.map((directive: any) => ({
      user_id: directive.user_id,
      profile_id: directive.user_id,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      institution_shared_code: institutionCode
    }));
  } catch (error) {
    console.error("Exception validation RPC:", error);
    throw error;
  }
};

// Fonction de fallback pour utiliser les fonctions RPC
export const validateWithExistingProfiles = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
) => {
  console.log("=== FALLBACK AVEC FONCTION RPC DEBUG ===");
  
  try {
    // Utiliser la fonction debug pour chercher le profil
    const { data: profilesData, error: profilesError } = await supabase.rpc("debug_patient_by_lastname" as any, {
      input_last_name: lastName.trim()
    });

    console.log("Profils trouvés via debug RPC:", { profilesData, profilesError });

    if (profilesError) {
      console.error("Erreur recherche debug RPC:", profilesError);
      throw new Error("Erreur lors de la recherche des profils.");
    }

    if (!profilesData || !Array.isArray(profilesData) || profilesData.length === 0) {
      throw new Error("Aucun profil patient trouvé correspondant aux informations fournies.");
    }

    // Filtrer les profils correspondants
    const matchingProfiles = profilesData.filter((profile: any) => 
      profile.first_name === firstName.trim() &&
      profile.birth_date === birthDate &&
      profile.institution_shared_code === institutionCode.trim()
    );

    console.log("Profils correspondants après filtrage:", matchingProfiles);
    
    if (matchingProfiles.length === 0) {
      throw new Error("Aucun profil patient trouvé correspondant aux informations fournies.");
    }

    // Retourner dans le même format que la fonction RPC
    return matchingProfiles.map((profile: any) => ({
      user_id: profile.user_id,
      profile_id: profile.profile_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      birth_date: profile.birth_date,
      institution_shared_code: profile.institution_shared_code
    }));

  } catch (error) {
    console.error("Erreur validation fallback:", error);
    throw error;
  }
};
