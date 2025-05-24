
import { supabase } from "@/integrations/supabase/client";

export const getSharedDocumentsByAccessCode = async (
  accessCode: string,
  firstName?: string,
  lastName?: string,
  birthDate?: string
): Promise<any[]> => {
  console.log("Recherche documents avec code:", { accessCode, firstName, lastName, birthDate });

  const { data, error } = await supabase.rpc(
    'get_shared_documents_by_access_code',
    {
      input_access_code: accessCode,
      input_first_name: firstName || null,
      input_last_name: lastName || null,
      input_birth_date: birthDate || null
    }
  );

  console.log("Résultat recherche documents:", { data, error });

  if (error) {
    throw error;
  }

  return data || [];
};
