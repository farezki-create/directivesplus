
import { supabase } from "@/integrations/supabase/client";

export const runInstitutionAccessDiagnostics = async (institutionCode: string) => {
  console.log("=== DIAGNOSTICS ACCÈS INSTITUTION ===");
  console.log("Code institution testé:", institutionCode);
  
  // Test 1: Connexion Supabase
  console.log("Test 1: Connexion Supabase");
  try {
    const { data, error } = await supabase.from('directives').select('count').limit(1);
    console.log("✓ Connexion Supabase OK:", { data, error });
  } catch (error) {
    console.error("✗ Connexion Supabase ÉCHEC:", error);
  }

  // Test 2: Permissions table directives
  console.log("Test 2: Permissions table directives");
  try {
    const { data, error } = await supabase
      .from('directives')
      .select('id, user_id, institution_code')
      .limit(3);
    console.log("✓ Accès directives OK:", { count: data?.length, error });
  } catch (error) {
    console.error("✗ Accès directives ÉCHEC:", error);
  }

  // Test 3: Permissions table profiles
  console.log("Test 3: Permissions table profiles");
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .limit(3);
    console.log("✓ Accès profiles OK:", { count: data?.length, error });
  } catch (error) {
    console.error("✗ Accès profiles ÉCHEC:", error);
  }

  // Test 4: Codes institution existants
  console.log("Test 4: Codes institution dans la base");
  try {
    const { data, error } = await supabase
      .from('directives')
      .select('institution_code, institution_code_expires_at, user_id')
      .not('institution_code', 'is', null);
    console.log("✓ Codes institution:", { 
      total: data?.length || 0, 
      valides: data?.filter(d => new Date(d.institution_code_expires_at) > new Date()).length || 0,
      error 
    });
  } catch (error) {
    console.error("✗ Recherche codes institution ÉCHEC:", error);
  }

  // Test 5: Recherche code spécifique
  console.log("Test 5: Recherche code spécifique");
  try {
    const { data, error } = await supabase
      .from('directives')
      .select('*')
      .eq('institution_code', institutionCode);
    console.log("✓ Code spécifique:", { trouvé: data?.length || 0, error });
    
    if (data && data.length > 0) {
      data.forEach(d => {
        const expired = new Date(d.institution_code_expires_at) <= new Date();
        console.log(`- User ${d.user_id}: ${expired ? 'EXPIRÉ' : 'VALIDE'} (expire le ${d.institution_code_expires_at})`);
      });
    }
  } catch (error) {
    console.error("✗ Code spécifique ÉCHEC:", error);
  }

  // Test 6: État authentification
  console.log("Test 6: État authentification");
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log("✓ Session auth:", { 
      connecté: !!session, 
      userId: session?.user?.id,
      error 
    });
  } catch (error) {
    console.error("✗ Vérification auth ÉCHEC:", error);
  }

  console.log("=== FIN DIAGNOSTICS ===");
};
