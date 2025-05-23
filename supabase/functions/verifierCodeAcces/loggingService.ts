
/**
 * Log an access attempt
 * @param supabase Supabase client
 * @param userId User ID (optional)
 * @param success Whether access was successful
 * @param details Additional details
 * @param accessCodeId Access code ID (optional)
 */
export async function logAccessAttempt(
  supabase: any,
  userId: string | null,
  success: boolean,
  details: string,
  accessCodeId: string | null = null
) {
  try {
    await supabase.from("logs_acces").insert({
      dossier_id: accessCodeId,
      succes: success,
      details
    });
  } catch (error) {
    console.error("Error logging access (continuing anyway):", error);
  }
}
