
import { supabase } from "@/integrations/supabase/client";

export const createBasicTestData = async () => {
  console.log("=== CRÉATION DONNÉES DE TEST BASIQUES ===");
  
  try {
    // Vérifier si les données existent déjà avec la fonction RPC
    const { data: existingData, error: checkError } = await supabase.rpc("debug_patient_by_lastname", {
      input_last_name: 'AREZKI'
    });

    console.log("Vérification données existantes:", { existingData, checkError });

    if (existingData && existingData.length > 0) {
      const targetProfile = existingData.find((p: any) => 
        p.first_name === 'FARID' && 
        p.birth_date === '1963-08-13' && 
        p.institution_shared_code === '9E5CUV7X'
      );
      
      if (targetProfile) {
        console.log("✓ Données de test déjà présentes");
        return true;
      }
    }

    console.log("Données de test non trouvées, vérification dans profiles");
    
    // Vérifier directement dans profiles
    const { data: userProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('last_name', 'AREZKI')
      .eq('first_name', 'FARID')
      .eq('birth_date', '1963-08-13');

    console.log("Profils utilisateur trouvés:", { userProfiles, profileError });

    if (!userProfiles || userProfiles.length === 0) {
      console.log("Aucun profil de test trouvé dans profiles");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur création données de test:", error);
    return false;
  }
};

export const validateInstitutionAccess = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
) => {
  console.log("=== VALIDATION BASIQUE ACCÈS INSTITUTION ===");
  console.log("Paramètres:", { lastName, firstName, birthDate, institutionCode });

  try {
    // Utiliser la fonction RPC principale
    const { data: rpcResult, error: rpcError } = await supabase.rpc("get_patient_directives_by_institution_access", {
      input_last_name: lastName,
      input_first_name: firstName,
      input_birth_date: birthDate,
      input_shared_code: institutionCode
    });

    console.log("Résultat validation RPC:", { rpcResult, rpcError });

    if (rpcError) {
      throw new Error(`Erreur RPC: ${rpcError.message}`);
    }

    if (!rpcResult || rpcResult.length === 0) {
      throw new Error("Aucun profil correspondant trouvé");
    }

    // Transformer le résultat au format attendu
    return rpcResult.map((profile: any) => ({
      user_id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      birth_date: profile.birth_date,
      institution_shared_code: profile.institution_shared_code,
      directives: [] // Les directives seront récupérées séparément si nécessaire
    }));

  } catch (error) {
    console.error("Erreur validation accès:", error);
    throw error;
  }
};
