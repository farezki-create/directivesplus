
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { DeletionOperationResult } from "./types.ts";

/**
 * Interface to define deletion operation
 */
interface DeleteOperation {
  table: string;
  description: string;
}

/**
 * Define all delete operations in the correct order to avoid foreign key constraint violations
 */
const deleteOperations: DeleteOperation[] = [
  { table: "questionnaire_preferences_responses", description: "Questionnaire preferences responses" },
  { table: "questionnaire_responses", description: "Questionnaire responses" },
  { table: "questionnaire_synthesis", description: "Questionnaire synthesis" },
  { table: "questionnaire_medical", description: "Medical questionnaire" },
  { table: "user_signatures", description: "Signatures" },
  { table: "trusted_persons", description: "Trusted persons" },
  { table: "pdf_documents", description: "PDF documents" },
  { table: "medical_documents", description: "Medical documents" },
  { table: "medical_data", description: "Medical data" },
  { table: "document_access_logs", description: "Access logs" },
  { table: "document_access_codes", description: "Document access codes" },
  { table: "directives", description: "Directives" },
  { table: "advance_directives", description: "Advanced directives" },
  { table: "orders", description: "Orders" },
  { table: "reviews", description: "Reviews" },
  { table: "profiles", description: "Profile" },
];

/**
 * Delete all user data from the database
 * @param supabase Supabase client
 * @param userId User ID
 * @returns Results of deletion operations
 */
export async function deleteUserData(supabase: SupabaseClient, userId: string): Promise<DeletionOperationResult[]> {
  const results: DeletionOperationResult[] = [];
  
  for (const operation of deleteOperations) {
    try {
      await supabase
        .from(operation.table)
        .delete()
        .eq("user_id", userId);
      
      results.push({table: operation.table, success: true});
    } catch (err) {
      console.error(`Error deleting ${operation.description}:`, err);
      results.push({
        table: operation.table, 
        success: false, 
        error: err instanceof Error ? err.message : String(err)
      });
      // Continue even if there's an error
    }
  }
  
  return results;
}
