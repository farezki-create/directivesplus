
import { supabase } from "@/integrations/supabase/client";

export const validateInstitutionCodeWithRPC = async (
  lastName: string,
  firstName: string, 
  birthDate: string,
  institutionCode: string
) => {
  console.log("=== VALIDATION AVEC RPC (debug functions) ===");
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

    // Essayer la fonction RPC existante
    const { data, error } = await supabase.rpc("get_directives_by_institution_code" as any, {
      input_nom: lastName.trim(),
      input_prenom: firstName.trim(),
      input_date_naissance: birthDate,
      input_institution_code: institutionCode.trim()
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

// Fonction de fallback pour utiliser la table profiles existante
export const validateWithExistingProfiles = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
) => {
  console.log("=== FALLBACK AVEC TABLE PROFILES ===");
  
  try {
    // D'abord, chercher dans la table directives pour le code institution
    const { data: directivesData, error: directivesError } = await supabase
      .from('directives')
      .select('id, user_id, institution_code, institution_code_expires_at')
      .eq('institution_code', institutionCode)
      .gt('institution_code_expires_at', new Date().toISOString());

    console.log("Directives trouvées:", { directivesData, directivesError });

    if (directivesError || !directivesData || directivesData.length === 0) {
      throw new Error("Code d'accès institution invalide ou expiré.");
    }

    // Ensuite, vérifier les profils correspondants
    const userIds = directivesData.map(d => d.user_id);
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birth_date')
      .in('id', userIds);

    console.log("Profils trouvés:", { profilesData, profilesError });

    if (profilesError || !profilesData) {
      throw new Error("Erreur lors de la vérification des profils.");
    }

    // Filtrer les profils qui correspondent aux critères
    const matchingProfiles = profilesData.filter(profile => {
      const nameMatch = profile.last_name?.toLowerCase().trim() === lastName.toLowerCase().trim() &&
                       profile.first_name?.toLowerCase().trim() === firstName.toLowerCase().trim();
      const dateMatch = profile.birth_date === birthDate;
      
      console.log("Vérification profil:", {
        profile: profile,
        nameMatch,
        dateMatch,
        criteria: { lastName, firstName, birthDate }
      });
      
      return nameMatch && dateMatch;
    });

    if (matchingProfiles.length === 0) {
      throw new Error("Aucun profil patient trouvé correspondant aux informations fournies.");
    }

    console.log("Profils correspondants:", matchingProfiles);
    
    // Retourner dans le même format que la fonction RPC
    return matchingProfiles.map(profile => ({
      user_id: profile.id,
      profile_id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      birth_date: profile.birth_date,
      institution_shared_code: institutionCode
    }));

  } catch (error) {
    console.error("Erreur validation fallback:", error);
    throw error;
  }
};
