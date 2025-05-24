
import { supabase } from "@/integrations/supabase/client";

export const runInstitutionAccessDiagnostics = async (institutionCode: string) => {
  console.log("=== DIAGNOSTICS ACCÈS INSTITUTION (RPC) ===");
  console.log("Code institution testé:", institutionCode);
  
  // Test 1: Connexion Supabase
  console.log("Test 1: Connexion Supabase");
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    console.log("✓ Connexion Supabase OK:", { data, error });
  } catch (error) {
    console.error("✗ Connexion Supabase ÉCHEC:", error);
  }

  // Test 2: Permissions table profiles
  console.log("Test 2: Permissions table profiles");
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birth_date')
      .limit(3);
    console.log("✓ Accès profiles OK:", { count: data?.length, error });
  } catch (error) {
    console.error("✗ Accès profiles ÉCHEC:", error);
  }

  // Test 3: Test de la fonction debug RPC simple
  console.log("Test 3: Fonction debug RPC simple");
  try {
    const { data, error } = await supabase.rpc("debug_patient_by_lastname", {
      input_last_name: "AREZKI"
    });
    console.log("✓ Debug RPC simple:", { data, error });
    
    if (data && Array.isArray(data) && data.length > 0) {
      data.forEach((profile: any) => {
        console.log(`- Profile ${profile.profile_id}: ${profile.first_name} ${profile.last_name} (${profile.birth_date}) - Code: ${profile.institution_shared_code}`);
      });
    }
  } catch (error) {
    console.error("✗ Debug RPC simple ÉCHEC:", error);
  }

  // Test 4: Test fonction debug étape par étape
  console.log("Test 4: Fonction debug étape par étape");
  try {
    const { data, error } = await supabase.rpc("debug_institution_access_step_by_step", {
      input_last_name: "AREZKI",
      input_first_name: "FARID",
      input_birth_date: "1963-08-13",
      input_shared_code: institutionCode
    });
    console.log("✓ Debug étape par étape:", { data, error });
    
    if (data && Array.isArray(data)) {
      data.forEach((step: any) => {
        console.log(`${step.step_name}: ${step.found_count} résultat(s) - ${step.details}`);
      });
    }
  } catch (error) {
    console.error("✗ Debug étape par étape ÉCHEC:", error);
  }

  // Test 5: Test de la fonction RPC principale
  console.log("Test 5: Fonction RPC principale");
  try {
    const { data, error } = await supabase.rpc("get_patient_directives_by_institution_access", {
      input_last_name: "AREZKI",
      input_first_name: "FARID",
      input_birth_date: "1963-08-13",
      input_shared_code: institutionCode
    });
    console.log("✓ RPC principale:", { data, error });
    
    if (data && Array.isArray(data) && data.length > 0) {
      data.forEach((profile: any) => {
        console.log(`- Profile ${profile.id}: ${profile.first_name} ${profile.last_name} - Code: ${profile.institution_shared_code}`);
      });
    }
  } catch (error) {
    console.error("✗ RPC principale ÉCHEC:", error);
  }

  console.log("=== FIN DIAGNOSTICS ===");
};
