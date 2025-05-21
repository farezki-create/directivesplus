
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

/**
 * Log an account deletion event
 * @param supabase Supabase client
 * @param userId User ID
 * @param success Whether the deletion was successful
 * @param details Additional details
 */
export async function logAccountDeletion(
  supabase: SupabaseClient,
  userId: string,
  success: boolean,
  details: string
) {
  try {
    await supabase.from("document_access_logs").insert({
      user_id: userId,
      nom_consultant: "System",
      prenom_consultant: "Account Deletion",
      success,
      details: `Account deletion: ${details}`
    });
  } catch (error) {
    console.error("Error logging account deletion:", error);
    // Continue execution even if logging fails
  }
}
