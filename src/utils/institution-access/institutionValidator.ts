
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
    // 1. Recherche du profil patient
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .ilike('last_name', lastName.trim())
      .ilike('first_name', firstName.trim())
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

    // 2. Vérification du code institution pour chaque profil
    for (const profile of profiles) {
      const { data: directives, error: directiveError } = await supabase
        .from('directives')
        .select('*')
        .eq('user_id', profile.id)
        .eq('institution_code', institutionCode.trim())
        .gt('institution_code_expires_at', new Date().toISOString());

      console.log(`Directives pour ${profile.id}:`, directives);

      if (directives && directives.length > 0) {
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

    return {
      success: false,
      message: "Code d'accès institution invalide ou expiré"
    };

  } catch (error) {
    console.error("Erreur validation:", error);
    return {
      success: false,
      message: "Erreur technique lors de la validation"
    };
  }
};

// Créer des données de test si nécessaires
export const createTestData = async () => {
  try {
    console.log("Vérification données de test...");
    
    // Vérifier si le profil test existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('last_name', 'AREZKI')
      .eq('first_name', 'FARID')
      .eq('birth_date', '1963-08-13')
      .maybeSingle();

    if (!existingProfile) {
      console.log("Profil de test non trouvé - les données doivent être créées via l'interface admin");
    } else {
      console.log("Profil de test existant:", existingProfile.id);
    }

    return true;
  } catch (error) {
    console.error("Erreur vérification données test:", error);
    return false;
  }
};
