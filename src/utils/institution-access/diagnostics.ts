
import { supabase } from "@/integrations/supabase/client";

export const runInstitutionAccessDiagnostics = async (institutionCode: string) => {
  console.log("=== DIAGNOSTICS ACCÈS INSTITUTION ===");
  console.log("Code institution testé:", institutionCode);
  
  // Test 1: Connexion Supabase
  console.log("Test 1: Connexion Supabase");
  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    console.log("✓ Connexion Supabase OK:", { data, error });
  } catch (error) {
    console.error("✗ Connexion Supabase ÉCHEC:", error);
  }

  // Test 2: Permissions table user_profiles
  console.log("Test 2: Permissions table user_profiles");
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, user_id, last_name, first_name, institution_shared_code')
      .limit(3);
    console.log("✓ Accès user_profiles OK:", { count: data?.length, error });
  } catch (error) {
    console.error("✗ Accès user_profiles ÉCHEC:", error);
  }

  // Test 3: Codes institution existants dans user_profiles
  console.log("Test 3: Codes institution dans user_profiles");
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('institution_shared_code, user_id, last_name, first_name')
      .not('institution_shared_code', 'is', null);
    console.log("✓ Codes institution:", { 
      total: data?.length || 0,
      error 
    });
  } catch (error) {
    console.error("✗ Recherche codes institution ÉCHEC:", error);
  }

  // Test 4: Recherche code spécifique
  console.log("Test 4: Recherche code spécifique");
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('institution_shared_code', institutionCode);
    console.log("✓ Code spécifique:", { trouvé: data?.length || 0, error });
    
    if (data && data.length > 0) {
      data.forEach(d => {
        console.log(`- User ${d.user_id}: ${d.first_name} ${d.last_name} (${d.birth_date})`);
      });
    }
  } catch (error) {
    console.error("✗ Code spécifique ÉCHEC:", error);
  }

  // Test 5: Test de la fonction debug
  console.log("Test 5: Fonction debug RPC");
  try {
    const { data, error } = await supabase.rpc("debug_patient_by_lastname" as any, {
      input_last_name: "AREZKI"
    });
    console.log("✓ Debug RPC:", { data, error });
  } catch (error) {
    console.error("✗ Debug RPC ÉCHEC:", error);
  }

  // Test 6: Test fonction debug étape par étape
  console.log("Test 6: Fonction debug étape par étape");
  try {
    const { data, error } = await supabase.rpc("debug_institution_access_step_by_step" as any, {
      input_last_name: "AREZKI",
      input_first_name: "FARID",
      input_birth_date: "1963-08-13",
      input_shared_code: institutionCode
    });
    console.log("✓ Debug étape par étape:", { data, error });
  } catch (error) {
    console.error("✗ Debug étape par étape ÉCHEC:", error);
  }

  console.log("=== FIN DIAGNOSTICS ===");
};
