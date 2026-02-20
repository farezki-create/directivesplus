
import { supabase } from "@/integrations/supabase/client";

export const runComprehensiveDiagnostics = async (shareCode: string) => {
  const { data: allSharedDocs, error: allError } = await supabase
    .from('shared_documents')
    .select('*');

  return { allSharedDocs, allError };
};

export const checkProfilesTable = async (shareCode: string) => {
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, medical_access_code')
    .not('medical_access_code', 'is', null);

  return { profilesData, profilesError };
};

export const testRpcFunction = async (shareCode: string) => {
  try {
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('get_shared_documents_by_access_code', { 
        input_access_code: shareCode 
      });
    return { rpcResult, rpcError };
  } catch (rpcErr) {
    return { rpcResult: null, rpcError: rpcErr };
  }
};

export const runExplicitTableSearches = async (shareCode: string) => {
  const { data: sharedDocsData, error: sharedDocsError } = await supabase
    .from('shared_documents')
    .select('*')
    .or(`access_code.eq.${shareCode}`);

  const { data: docAccessData, error: docAccessError } = await supabase
    .from('document_access_codes')
    .select('*')
    .or(`access_code.eq.${shareCode}`);

  const { data: profilesAccessData, error: profilesAccessError } = await supabase
    .from('profiles')
    .select('*')
    .or(`medical_access_code.eq.${shareCode}`);

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
  // Diagnostic data available for debugging if needed
};
