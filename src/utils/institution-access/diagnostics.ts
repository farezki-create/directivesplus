
import { supabase } from "@/integrations/supabase/client";

export const runInstitutionAccessDiagnostics = async (institutionCode: string) => {
  console.log("=== RUNNING INSTITUTION ACCESS DIAGNOSTICS ===");
  
  // Test 1: Vérifier la connexion Supabase
  console.log("Test 1: Supabase connection");
  try {
    const { data, error } = await supabase.from('directives').select('count').limit(1);
    console.log("Supabase connection test:", { data, error });
  } catch (error) {
    console.error("Supabase connection failed:", error);
  }

  // Test 2: Vérifier les permissions sur la table directives
  console.log("Test 2: Directives table permissions");
  try {
    const { data, error } = await supabase
      .from('directives')
      .select('id, user_id, institution_code')
      .limit(5);
    console.log("Directives access test:", { data, error, count: data?.length });
  } catch (error) {
    console.error("Directives access failed:", error);
  }

  // Test 3: Vérifier les permissions sur la table profiles
  console.log("Test 3: Profiles table permissions");
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .limit(5);
    console.log("Profiles access test:", { data, error, count: data?.length });
  } catch (error) {
    console.error("Profiles access failed:", error);
  }

  // Test 4: Rechercher le code d'institution spécifique
  console.log("Test 4: Institution code search");
  try {
    const { data, error } = await supabase
      .from('directives')
      .select('*')
      .eq('institution_code', institutionCode);
    console.log("Institution code search:", { data, error, count: data?.length });
  } catch (error) {
    console.error("Institution code search failed:", error);
  }

  // Test 5: Vérifier l'état d'authentification
  console.log("Test 5: Authentication state");
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log("Auth session:", { 
      hasSession: !!session, 
      userId: session?.user?.id,
      error 
    });
  } catch (error) {
    console.error("Auth check failed:", error);
  }

  console.log("=== DIAGNOSTICS COMPLETE ===");
};
