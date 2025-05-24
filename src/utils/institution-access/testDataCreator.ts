
import { supabase } from "@/integrations/supabase/client";

export const createTestDataForInstitutionAccess = async () => {
  console.log("=== CRÉATION DONNÉES DE TEST ===");
  
  try {
    // Créer un profil dans user_profiles
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: '550e8400-e29b-41d4-a716-446655440000', // UUID fixe pour les tests
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        first_name: 'FARID',
        last_name: 'AREZKI',
        birth_date: '1963-08-13',
        institution_shared_code: '9E5CUV7X'
      })
      .select()
      .single();

    console.log("Profil créé/mis à jour dans user_profiles:", { profileData, profileError });

    if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
      throw profileError;
    }

    // Vérifier si on peut créer une directive (optionnel car le user_id pourrait ne pas exister dans auth.users)
    try {
      const { data: directiveData, error: directiveError } = await supabase
        .from('directives')
        .select('id')
        .eq('user_id', '550e8400-e29b-41d4-a716-446655440000')
        .eq('institution_code', '9E5CUV7X')
        .maybeSingle();

      if (!directiveData && !directiveError) {
        console.log("Aucune directive existante, mais n'essayons pas d'en créer une sans utilisateur auth valide");
      } else {
        console.log("Directive existante trouvée:", directiveData);
      }
    } catch (directiveError) {
      console.log("Directive non créée (utilisateur auth manquant):", directiveError);
    }

    console.log("✓ Données de test créées avec succès dans user_profiles");
    return true;
  } catch (error) {
    console.error("✗ Erreur création données de test:", error);
    return false;
  }
};
