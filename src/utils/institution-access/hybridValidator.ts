
import { supabase } from "@/integrations/supabase/client";
import { InstitutionValidationResult } from "./institutionValidator";

export const validateInstitutionAccessHybrid = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
): Promise<InstitutionValidationResult> => {
  console.log("=== VALIDATION HYBRIDE ACCÈS INSTITUTION ===");
  console.log("Paramètres:", { lastName, firstName, birthDate, institutionCode });

  try {
    // Chercher dans user_profiles (données RPC)
    console.log("Recherche dans user_profiles...");
    const { data: userProfilesData, error: userProfilesError } = await supabase.rpc(
      'verify_access_identity',
      {
        input_lastname: lastName.trim(),
        input_firstname: firstName.trim(),
        input_birthdate: birthDate,
        input_access_code: institutionCode.trim()
      }
    );
    
    if (userProfilesData && userProfilesData.length > 0) {
      console.log("✓ Validation réussie avec user_profiles");
      const profile = userProfilesData[0];
      
      return {
        success: true,
        message: `Accès autorisé pour ${profile.first_name} ${profile.last_name}`,
        patientData: {
          user_id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          birth_date: profile.birth_date,
          directives: []
        }
      };
    }

    // Chercher dans profiles + directives (méthode originale)
    console.log("Recherche dans profiles + directives...");
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birth_date')
      .eq('last_name', lastName.trim())
      .eq('first_name', firstName.trim())
      .eq('birth_date', birthDate);

    if (profiles && profiles.length > 0) {
      const profile = profiles[0];
      
      const { data: directives } = await supabase
        .from('directives')
        .select('id, content, created_at')
        .eq('user_id', profile.id)
        .eq('institution_code', institutionCode.trim())
        .gt('institution_code_expires_at', new Date().toISOString());

      if (directives && directives.length > 0) {
        console.log("✓ Validation réussie avec profiles + directives");
        
        return {
          success: true,
          message: `Accès autorisé pour ${profile.first_name} ${profile.last_name}`,
          patientData: {
            user_id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            birth_date: profile.birth_date,
            directives: directives
          }
        };
      }
    }

    // Aucune méthode n'a fonctionné
    return {
      success: false,
      message: "Aucun patient trouvé avec ces informations. Vérifiez que toutes les données sont correctes et que le code d'accès n'a pas expiré."
    };

  } catch (error) {
    console.error("Erreur validation hybride:", error);
    return {
      success: false,
      message: "Erreur technique lors de la validation. Réessayez dans quelques instants."
    };
  }
};
