
import { supabase } from "@/integrations/supabase/client";

export interface InstitutionAccessResult {
  success: boolean;
  message: string;
  directiveData?: {
    user_id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    directives: any[];
  };
}

/**
 * Validation d'accès institution - Version simplifiée
 * Utilise uniquement les tables profiles et directives existantes
 */
export const validateInstitutionAccess = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
): Promise<InstitutionAccessResult> => {
  console.log("=== VALIDATION ACCÈS INSTITUTION ===");
  console.log("Recherche pour:", { lastName, firstName, birthDate, institutionCode });
  
  try {
    // 1. Rechercher le profil du patient
    console.log("Étape 1: Recherche du profil patient");
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birth_date')
      .eq('last_name', lastName.trim())
      .eq('first_name', firstName.trim())
      .eq('birth_date', birthDate);

    console.log("Résultat recherche profils:", { profiles, profileError });

    if (profileError) {
      console.error("Erreur recherche profils:", profileError);
      return {
        success: false,
        message: "Erreur lors de la recherche du patient"
      };
    }

    if (!profiles || profiles.length === 0) {
      console.log("Aucun profil trouvé");
      return {
        success: false,
        message: "Aucun patient trouvé avec ces informations (nom, prénom, date de naissance)"
      };
    }

    console.log(`${profiles.length} profil(s) trouvé(s)`);

    // 2. Pour chaque profil trouvé, vérifier le code d'accès institution
    console.log("Étape 2: Vérification du code d'accès institution");
    
    for (const profile of profiles) {
      console.log(`Vérification code pour profil ${profile.id}`);
      
      const { data: directives, error: directiveError } = await supabase
        .from('directives')
        .select('id, user_id, content, created_at')
        .eq('user_id', profile.id)
        .eq('institution_code', institutionCode.trim())
        .gt('institution_code_expires_at', new Date().toISOString());

      console.log(`Directives pour ${profile.id}:`, { directives, directiveError });

      if (directiveError) {
        console.error("Erreur recherche directives:", directiveError);
        continue; // Continuer avec le profil suivant
      }

      if (directives && directives.length > 0) {
        console.log("✅ Code d'accès valide trouvé!");
        return {
          success: true,
          message: `Accès autorisé pour ${profile.first_name} ${profile.last_name}`,
          directiveData: {
            user_id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            birth_date: profile.birth_date,
            directives: directives
          }
        };
      }
    }

    // Aucun code valide trouvé
    console.log("❌ Aucun code d'accès institution valide");
    return {
      success: false,
      message: "Code d'accès institution invalide ou expiré pour ce patient"
    };

  } catch (error) {
    console.error("Erreur inattendue:", error);
    return {
      success: false,
      message: "Erreur technique lors de la validation"
    };
  }
};

/**
 * Créer des données de test pour faciliter les tests
 */
export const createTestData = async (): Promise<boolean> => {
  console.log("=== CRÉATION DONNÉES DE TEST ===");
  
  try {
    // Vérifier si le profil de test existe déjà
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('last_name', 'AREZKI')
      .eq('first_name', 'FARID')
      .eq('birth_date', '1963-08-13')
      .maybeSingle();

    let profileId = existingProfile?.id;

    if (!existingProfile) {
      console.log("Création du profil de test...");
      // Essayer de créer le profil (peut échouer à cause des RLS)
      const testUserId = '550e8400-e29b-41d4-a716-446655440000';
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: testUserId,
          first_name: 'FARID',
          last_name: 'AREZKI',
          birth_date: '1963-08-13'
        })
        .select('id')
        .maybeSingle();

      if (createError) {
        console.log("Impossible de créer le profil de test (RLS actif)");
        return false;
      }
      
      profileId = newProfile?.id || testUserId;
    }

    if (profileId) {
      console.log("Profil disponible:", profileId);
      
      // Vérifier si la directive de test existe
      const { data: existingDirective } = await supabase
        .from('directives')
        .select('id')
        .eq('user_id', profileId)
        .eq('institution_code', '9E5CUV7X')
        .maybeSingle();

      if (!existingDirective) {
        console.log("Création de la directive de test...");
        const { error: directiveError } = await supabase
          .from('directives')
          .insert({
            user_id: profileId,
            content: {
              title: "Directives anticipées - AREZKI FARID",
              patient: {
                nom: "AREZKI",
                prenom: "FARID",
                date_naissance: "1963-08-13"
              }
            },
            institution_code: '9E5CUV7X',
            institution_code_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (directiveError) {
          console.log("Impossible de créer la directive de test (RLS actif)");
          return false;
        }
      }
    }

    console.log("✅ Données de test prêtes");
    return true;
  } catch (error) {
    console.error("Erreur création données de test:", error);
    return false;
  }
};
