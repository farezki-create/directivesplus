
import { supabase } from "@/integrations/supabase/client";

export const createTestDataForInstitutionAccess = async () => {
  console.log("=== CRÉATION DONNÉES DE TEST ===");
  
  try {
    // Créer un profil test
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: '550e8400-e29b-41d4-a716-446655440000', // UUID fixe pour les tests
        first_name: 'FARID',
        last_name: 'AREZKI',
        birth_date: '1963-08-13'
      })
      .select()
      .single();

    console.log("Profil créé/mis à jour:", { profileData, profileError });

    if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
      throw profileError;
    }

    // Créer une directive avec code institution
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30); // 30 jours

    const { data: directiveData, error: directiveError } = await supabase
      .from('directives')
      .upsert({
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        content: {
          title: "Directives anticipées - Test Institution",
          patient: {
            nom: "AREZKI",
            prenom: "FARID",
            date_naissance: "1963-08-13"
          },
          created_for_institution_access: true
        },
        institution_code: '9E5CUV7X',
        institution_code_expires_at: expirationDate.toISOString()
      })
      .select();

    console.log("Directive créée/mise à jour:", { directiveData, directiveError });

    if (directiveError) {
      throw directiveError;
    }

    console.log("✓ Données de test créées avec succès");
    return true;
  } catch (error) {
    console.error("✗ Erreur création données de test:", error);
    return false;
  }
};
