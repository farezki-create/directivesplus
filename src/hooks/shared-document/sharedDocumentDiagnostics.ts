
import { supabase } from "@/integrations/supabase/client";

export const runComprehensiveDiagnostics = async (shareCode: string) => {
  console.log("=== DIAGNOSTIC ÉTENDU SHARED DOCUMENTS ===");
  console.log("Code recherché:", shareCode);
  console.log("Type du code:", typeof shareCode);
  console.log("Longueur du code:", shareCode.length);

  // 1. Vérifier TOUS les documents partagés
  const { data: allSharedDocs, error: allError } = await supabase
    .from('shared_documents')
    .select('*');

  console.log("1. TOUS les documents partagés:", { allSharedDocs, allError });
  console.log("1. Nombre total:", allSharedDocs?.length || 0);

  if (allSharedDocs && allSharedDocs.length > 0) {
    console.log("1. Codes existants:", allSharedDocs.map(doc => ({
      code: doc.access_code,
      type: typeof doc.access_code,
      length: doc.access_code?.length,
      active: doc.is_active,
      expires: doc.expires_at
    })));
  }

  return { allSharedDocs, allError };
};

export const checkProfilesTable = async (shareCode: string) => {
  // 2. Vérifier dans la table profiles (au cas où le code serait là)
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, medical_access_code')
    .not('medical_access_code', 'is', null);

  console.log("2. Codes dans profiles:", { profilesData, profilesError });
  return { profilesData, profilesError };
};

export const testRpcFunction = async (shareCode: string) => {
  // 5. Test de requête RPC si elle existe
  try {
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('get_shared_documents_by_access_code', { 
        input_access_code: shareCode 
      });
    console.log("5. Test RPC get_shared_documents_by_access_code:", { rpcResult, rpcError });
    return { rpcResult, rpcError };
  } catch (rpcErr) {
    console.log("5. RPC non disponible ou erreur:", rpcErr);
    return { rpcResult: null, rpcError: rpcErr };
  }
};

export const runExplicitTableSearches = async (shareCode: string) => {
  console.log("6. Recherche explicite dans chaque table:");
  
  // Recherche dans shared_documents avec différentes conditions
  const { data: sharedDocsData, error: sharedDocsError } = await supabase
    .from('shared_documents')
    .select('*')
    .or(`access_code.eq.${shareCode}`);
  console.log("6a. shared_documents:", { sharedDocsData, sharedDocsError });

  // Recherche dans document_access_codes avec différentes conditions
  const { data: docAccessData, error: docAccessError } = await supabase
    .from('document_access_codes')
    .select('*')
    .or(`access_code.eq.${shareCode}`);
  console.log("6b. document_access_codes:", { docAccessData, docAccessError });

  // Recherche dans profiles avec différentes conditions
  const { data: profilesAccessData, error: profilesAccessError } = await supabase
    .from('profiles')
    .select('*')
    .or(`medical_access_code.eq.${shareCode}`);
  console.log("6c. profiles:", { profilesAccessData, profilesAccessError });

  return {
    sharedDocsData,
    sharedDocsError,
    docAccessData,
    docAccessError,
    profilesAccessData,
    profilesAccessError
  };
};

export const runFinalDiagnostic = (shareCode: string, allSharedDocs: any[]) => {
  console.log("=== DIAGNOSTIC FINAL DÉTAILLÉ ===");
  console.log("Code recherché (brut):", JSON.stringify(shareCode));
  console.log("Code recherché (échappé):", escape(shareCode));
  console.log("Code en hexa:", Array.from(shareCode).map(c => c.charCodeAt(0).toString(16)).join(' '));
  
  if (allSharedDocs) {
    allSharedDocs.forEach((doc, index) => {
      console.log(`Comparaison ${index + 1}:`, {
        codeDB: JSON.stringify(doc.access_code),
        codeRecherche: JSON.stringify(shareCode),
        egal: doc.access_code === shareCode,
        equalIgnoreCase: doc.access_code?.toLowerCase() === shareCode.toLowerCase(),
        includes: doc.access_code?.includes(shareCode),
        active: doc.is_active,
        expire: doc.expires_at
      });
    });
  }
};
