
import { supabase } from "@/integrations/supabase/client";

export const validateInstitutionCodeWithRPC = async (
  lastName: string,
  firstName: string, 
  birthDate: string,
  institutionCode: string
) => {
  console.log("=== VALIDATION AVEC RPC (user_profiles) ===");
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
      debugData.forEach(step => {
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
    return data.map(directive => ({
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

// Fonction de fallback pour utiliser la table user_profiles
export const validateWithExistingProfiles = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
) => {
  console.log("=== FALLBACK AVEC TABLE USER_PROFILES ===");
  
  try {
    // Rechercher directement dans user_profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('last_name', lastName.trim())
      .eq('first_name', firstName.trim())
      .eq('birth_date', birthDate)
      .eq('institution_shared_code', institutionCode.trim());

    console.log("Profils trouvés dans user_profiles:", { profilesData, profilesError });

    if (profilesError) {
      console.error("Erreur recherche user_profiles:", profilesError);
      throw new Error("Erreur lors de la recherche des profils.");
    }

    if (!profilesData || profilesData.length === 0) {
      throw new Error("Aucun profil patient trouvé correspondant aux informations fournies.");
    }

    console.log("Profils correspondants:", profilesData);
    
    // Retourner dans le même format que la fonction RPC
    return profilesData.map(profile => ({
      user_id: profile.user_id,
      profile_id: profile.id,
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
