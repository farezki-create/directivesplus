
import { supabase } from "@/integrations/supabase/client";

export interface InstitutionValidationResult {
  success: boolean;
  message: string;
  patientData?: {
    user_id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    directives: any[];
  };
}

export const validateInstitutionAccess = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
): Promise<InstitutionValidationResult> => {
  console.log("=== VALIDATION ACCÈS INSTITUTION ===");
  console.log("Recherche:", { lastName, firstName, birthDate, institutionCode });

  try {
    // 1. Recherche du profil patient avec correspondance exacte
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('last_name', lastName.trim())
      .eq('first_name', firstName.trim())
      .eq('birth_date', birthDate);

    console.log("Profils trouvés:", profiles);

    if (profileError) {
      console.error("Erreur profils:", profileError);
      return {
        success: false,
        message: "Erreur lors de la recherche du patient"
      };
    }

    if (!profiles || profiles.length === 0) {
      return {
        success: false,
        message: "Aucun patient trouvé avec ces informations (nom, prénom, date de naissance)"
      };
    }

    const profile = profiles[0];

    // 2. Vérification du code institution
    const { data: directives, error: directiveError } = await supabase
      .from('directives')
      .select('*')
      .eq('user_id', profile.id)
      .eq('institution_code', institutionCode.trim())
      .gt('institution_code_expires_at', new Date().toISOString());

    console.log(`Directives trouvées pour ${profile.id}:`, directives);

    if (directiveError) {
      console.error("Erreur directives:", directiveError);
      return {
        success: false,
        message: "Erreur lors de la vérification du code d'accès"
      };
    }

    if (!directives || directives.length === 0) {
      return {
        success: false,
        message: "Code d'accès institution invalide ou expiré"
      };
    }

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

  } catch (error) {
    console.error("Erreur validation:", error);
    return {
      success: false,
      message: "Erreur technique lors de la validation"
    };
  }
};
