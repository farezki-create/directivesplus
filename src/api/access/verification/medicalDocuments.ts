
import { supabase } from "@/integrations/supabase/client";
import type { MedicalDocument } from "@/hooks/types/dossierTypes";

/**
 * Fetches medical documents for a user
 */
export const getMedicalDocuments = async (userId: string): Promise<MedicalDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as MedicalDocument[];
  } catch (error) {
    console.error("Error retrieving medical documents:", error);
    return [];
  }
};
