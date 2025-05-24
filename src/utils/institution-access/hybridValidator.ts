
import { supabase } from "@/integrations/supabase/client";
import { validateWithTestData, searchInUserProfiles, getTestPatientData } from "./testDataManager";
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
    // Méthode 1: Vérifier avec les données de test en dur
    const isTestDataValid = await validateWithTestData(lastName, firstName, birthDate, institutionCode);
    
    if (isTestDataValid) {
      console.log("✓ Validation réussie avec données de test");
      const testData = getTestPatientData();
      
      return {
        success: true,
        message: `Accès autorisé pour ${testData.first_name} ${testData.last_name} (données de test)`,
        patientData: {
          user_id: testData.id,
          first_name: testData.first_name,
          last_name: testData.last_name,
          birth_date: testData.birth_date,
          directives: [{
            id: "test-directive-1",
            content: {
              title: "Directives anticipées de test",
              content: "Ceci est un document de test pour l'accès institution"
            },
            created_at: new Date().toISOString()
          }]
        }
      };
    }

    // Méthode 2: Chercher dans user_profiles (données RPC)
    const userProfilesResult = await searchInUserProfiles(lastName, firstName, birthDate, institutionCode);
    
    if (userProfilesResult.data && userProfilesResult.data.length > 0) {
      console.log("✓ Validation réussie avec user_profiles");
      const profile = userProfilesResult.data[0];
      
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

    // Méthode 3: Chercher dans profiles + directives (méthode originale)
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
