
import { supabase } from "@/integrations/supabase/client";

export const validateInstitutionAccessWithProfiles = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
) => {
  console.log("=== VALIDATION AVEC TABLES EXISTANTES ===");
  console.log("Données:", { lastName, firstName, birthDate, institutionCode });
  
  try {
    // Étape 1: Chercher dans la table profiles existante
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birth_date')
      .eq('last_name', lastName.trim())
      .eq('first_name', firstName.trim())
      .eq('birth_date', birthDate);

    console.log("Profils trouvés:", { profiles, profileError });

    if (profileError) {
      throw new Error("Erreur lors de la recherche des profils: " + profileError.message);
    }

    if (!profiles || profiles.length === 0) {
      throw new Error("Aucun profil trouvé avec ces nom, prénom et date de naissance.");
    }

    // Étape 2: Pour chaque profil trouvé, chercher les directives avec le code institution
    const results = [];
    for (const profile of profiles) {
      const { data: directives, error: directiveError } = await supabase
        .from('directives')
        .select('id, user_id, content, created_at')
        .eq('user_id', profile.id)
        .eq('institution_code', institutionCode.trim())
        .gt('institution_code_expires_at', new Date().toISOString());

      console.log(`Directives pour profil ${profile.id}:`, { directives, directiveError });

      if (directives && directives.length > 0) {
        results.push({
          user_id: profile.id,
          profile_id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          birth_date: profile.birth_date,
          institution_shared_code: institutionCode,
          directives: directives
        });
      }
    }

    if (results.length === 0) {
      throw new Error("Code d'accès institution invalide ou expiré pour ce patient.");
    }

    return results;

  } catch (error) {
    console.error("Erreur validation simple:", error);
    throw error;
  }
};

export const createTestProfileAndDirective = async () => {
  console.log("=== CRÉATION PROFIL ET DIRECTIVE DE TEST ===");
  
  try {
    // Vérifier si le profil existe déjà
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('last_name', 'AREZKI')
      .eq('first_name', 'FARID')
      .eq('birth_date', '1963-08-13')
      .maybeSingle();

    let profileId;
    
    if (existingProfile) {
      console.log("Profil de test déjà existant:", existingProfile.id);
      profileId = existingProfile.id;
    } else {
      // Créer un profil de test
      const testUserId = '550e8400-e29b-41d4-a716-446655440000';
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: testUserId,
          first_name: 'FARID',
          last_name: 'AREZKI',
          birth_date: '1963-08-13'
        })
        .select()
        .maybeSingle();

      if (profileError) {
        console.log("Profil de test ne peut pas être créé (normal si RLS actif):", profileError);
        return false;
      }

      profileId = newProfile?.id || testUserId;
      console.log("Profil de test créé:", profileId);
    }

    // Créer une directive de test si elle n'existe pas
    const { data: existingDirective } = await supabase
      .from('directives')
      .select('id')
      .eq('user_id', profileId)
      .eq('institution_code', '9E5CUV7X')
      .maybeSingle();

    if (!existingDirective) {
      const { data: newDirective, error: directiveError } = await supabase
        .from('directives')
        .insert({
          user_id: profileId,
          content: {
            title: "Directives anticipées - AREZKI FARID",
            patient: {
              nom: "AREZKI",
              prenom: "FARID",
              date_naissance: "1963-08-13"
            },
            documents: []
          },
          institution_code: '9E5CUV7X',
          institution_code_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .maybeSingle();

      if (directiveError) {
        console.log("Directive de test ne peut pas être créée (normal si RLS actif):", directiveError);
        return false;
      }

      console.log("Directive de test créée:", newDirective);
    } else {
      console.log("Directive de test déjà existante:", existingDirective.id);
    }

    return true;
  } catch (error) {
    console.error("Erreur création données de test:", error);
    return false;
  }
};
