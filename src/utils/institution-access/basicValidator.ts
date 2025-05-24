
import { supabase } from "@/integrations/supabase/client";

export const validateInstitutionAccess = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
) => {
  console.log("=== VALIDATION BASIQUE SANS RPC ===");
  console.log("Recherche pour:", { lastName, firstName, birthDate, institutionCode });
  
  try {
    // 1. Chercher le profil utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birth_date')
      .eq('last_name', lastName.trim())
      .eq('first_name', firstName.trim())
      .eq('birth_date', birthDate)
      .maybeSingle();

    console.log("Résultat recherche profil:", { profile, profileError });

    if (profileError) {
      console.error("Erreur lors de la recherche du profil:", profileError);
      throw new Error("Erreur lors de la recherche du profil");
    }

    if (!profile) {
      console.log("Aucun profil trouvé avec ces informations");
      throw new Error("Aucun profil trouvé avec ces informations personnelles");
    }

    // 2. Chercher les directives avec le code institution
    const { data: directives, error: directiveError } = await supabase
      .from('directives')
      .select('id, user_id, content, created_at')
      .eq('user_id', profile.id)
      .eq('institution_code', institutionCode.trim())
      .gt('institution_code_expires_at', new Date().toISOString());

    console.log("Résultat recherche directives:", { directives, directiveError });

    if (directiveError) {
      console.error("Erreur lors de la recherche des directives:", directiveError);
      throw new Error("Erreur lors de la recherche des directives");
    }

    if (!directives || directives.length === 0) {
      console.log("Aucune directive trouvée avec ce code institution");
      throw new Error("Code d'accès institution invalide ou expiré");
    }

    // 3. Retourner les résultats
    return [{
      user_id: profile.id,
      profile_id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      birth_date: profile.birth_date,
      institution_shared_code: institutionCode,
      directives: directives
    }];

  } catch (error) {
    console.error("Erreur dans validateInstitutionAccess:", error);
    throw error;
  }
};

export const createBasicTestData = async () => {
  console.log("=== CRÉATION DONNÉES DE TEST BASIQUES ===");
  
  try {
    // Essayer de créer un profil de test simple
    const testUserId = '550e8400-e29b-41d4-a716-446655440000';
    
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', testUserId)
      .maybeSingle();

    if (checkError) {
      console.log("Erreur vérification profil existant:", checkError);
    }

    if (!existingProfile) {
      console.log("Tentative de création du profil de test...");
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: testUserId,
          first_name: 'FARID',
          last_name: 'AREZKI',
          birth_date: '1963-08-13'
        });

      if (insertError) {
        console.log("Impossible de créer le profil (RLS actif):", insertError);
      } else {
        console.log("Profil de test créé avec succès");
      }
    }

    // Essayer de créer une directive de test
    const { data: existingDirective, error: directiveCheckError } = await supabase
      .from('directives')
      .select('id')
      .eq('user_id', testUserId)
      .eq('institution_code', '9E5CUV7X')
      .maybeSingle();

    if (!existingDirective && !directiveCheckError) {
      console.log("Tentative de création de la directive de test...");
      const { error: directiveInsertError } = await supabase
        .from('directives')
        .insert({
          user_id: testUserId,
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

      if (directiveInsertError) {
        console.log("Impossible de créer la directive (RLS actif):", directiveInsertError);
      } else {
        console.log("Directive de test créée avec succès");
      }
    }

    return true;
  } catch (error) {
    console.error("Erreur création données de test:", error);
    return false;
  }
};
