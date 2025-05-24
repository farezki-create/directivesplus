
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
  console.log("=== VALIDATION SIMPLIFIÉE ACCÈS INSTITUTION ===");
  console.log("Paramètres:", { lastName, firstName, birthDate, institutionCode });

  try {
    // D'abord, vérifier si l'utilisateur existe dans profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birth_date')
      .eq('last_name', lastName.trim())
      .eq('first_name', firstName.trim())
      .eq('birth_date', birthDate);

    console.log("Profils trouvés:", { profiles, profileError });

    if (profileError) {
      console.error("Erreur recherche profil:", profileError);
      return {
        success: false,
        message: "Erreur lors de la recherche du profil patient."
      };
    }

    if (!profiles || profiles.length === 0) {
      return {
        success: false,
        message: "Aucun patient trouvé avec ces nom, prénom et date de naissance."
      };
    }

    const profile = profiles[0];

    // Vérifier le code d'accès institution dans directives
    const { data: directives, error: directiveError } = await supabase
      .from('directives')
      .select('id, content, created_at')
      .eq('user_id', profile.id)
      .eq('institution_code', institutionCode.trim())
      .gt('institution_code_expires_at', new Date().toISOString());

    console.log("Directives avec code institution:", { directives, directiveError });

    if (directiveError) {
      console.error("Erreur recherche directives:", directiveError);
      return {
        success: false,
        message: "Erreur lors de la vérification du code d'accès."
      };
    }

    if (!directives || directives.length === 0) {
      // Vérifier si le code existe mais est expiré
      const { data: expiredDirectives } = await supabase
        .from('directives')
        .select('institution_code_expires_at')
        .eq('user_id', profile.id)
        .eq('institution_code', institutionCode.trim());

      if (expiredDirectives && expiredDirectives.length > 0) {
        return {
          success: false,
          message: "Le code d'accès institution a expiré. Demandez au patient de générer un nouveau code."
        };
      }

      return {
        success: false,
        message: "Code d'accès institution invalide pour ce patient."
      };
    }

    console.log("Validation réussie pour:", profile);

    return {
      success: true,
      message: `Accès autorisé pour ${profile.first_name} ${profile.last_name}`,
      patientData: {
        user_id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        birth_date: profile.birth_date,
        directives: directives || []
      }
    };

  } catch (error) {
    console.error("Erreur validation:", error);
    return {
      success: false,
      message: "Erreur technique lors de la validation. Vérifiez les informations saisies."
    };
  }
};
