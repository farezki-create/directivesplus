
import { supabase } from "@/integrations/supabase/client";

export const searchExactMatch = async (shareCode: string) => {
  const { data: exactMatch, error: exactError } = await supabase
    .from('shared_documents')
    .select('*')
    .eq('access_code', shareCode);

  console.log("3. Recherche exacte shared_documents:", { exactMatch, exactError });
  return { exactMatch, exactError };
};

export const searchAccessCodes = async (shareCode: string) => {
  const { data: accessCodes, error: accessError } = await supabase
    .from('document_access_codes')
    .select('*')
    .eq('access_code', shareCode);

  console.log("4. Recherche dans document_access_codes:", { accessCodes, accessError });
  return { accessCodes, accessError };
};

export const getAssociatedDocument = async (documentId: string) => {
  const { data: docData, error: docError } = await supabase
    .from('pdf_documents')
    .select('*')
    .eq('id', documentId)
    .single();

  return { docData, docError };
};
