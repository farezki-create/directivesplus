
/**
 * Journalise une tentative d'accès
 * @param supabase Client Supabase
 * @param userId ID de l'utilisateur
 * @param success Succès de la tentative
 * @param details Détails supplémentaires
 * @param accessCodeId ID du code d'accès (optionnel)
 */
export async function logAccessAttempt(
  supabase: any,
  userId: string | null,
  success: boolean,
  details: string,
  accessCodeId: string | null = null
) {
  try {
    await supabase.from("document_access_logs").insert({
      user_id: userId || "00000000-0000-0000-0000-000000000000",
      access_code_id: accessCodeId,
      nom_consultant: "Access via Edge Function",
      prenom_consultant: "System",
      success,
      details
    });
  } catch (error) {
    console.error("Erreur de journalisation:", error);
  }
}
