
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Interface to define deletion operation
interface DeleteOperation {
  table: string;
  description: string;
}

// Define all delete operations in the correct order to avoid foreign key constraint violations
const deleteOperations: DeleteOperation[] = [
  { table: "questionnaire_preferences_responses", description: "Réponses au questionnaire" },
  { table: "questionnaire_responses", description: "Réponses au questionnaire" },
  { table: "questionnaire_synthesis", description: "Synthèses de questionnaire" },
  { table: "questionnaire_medical", description: "Questionnaire médical" },
  { table: "user_signatures", description: "Signatures" },
  { table: "trusted_persons", description: "Personnes de confiance" },
  { table: "pdf_documents", description: "Documents PDF" },
  { table: "medical_documents", description: "Documents médicaux" },
  { table: "medical_data", description: "Données médicales" },
  { table: "document_access_logs", description: "Logs d'accès" },
  { table: "document_access_codes", description: "Codes d'accès aux documents" },
  { table: "directives", description: "Directives" },
  { table: "advance_directives", description: "Directives avancées" },
  { table: "orders", description: "Commandes" },
  { table: "reviews", description: "Avis" },
  { table: "profiles", description: "Profil" },
];

// Delete all user data from the database
export async function deleteUserData(supabase: SupabaseClient, userId: string) {
  const results: {table: string, success: boolean, error?: string}[] = [];
  
  for (const operation of deleteOperations) {
    try {
      await supabase
        .from(operation.table)
        .delete()
        .eq("user_id", userId);
      
      console.log(`${operation.description} supprimées`);
      results.push({table: operation.table, success: true});
    } catch (err) {
      console.log(`Erreur lors de la suppression des ${operation.description}:`, err);
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
