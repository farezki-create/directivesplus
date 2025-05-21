
import { logAccessAttempt } from "./loggingService.ts";

/**
 * Vérifie l'existence d'un code d'accès
 * @param supabase Client Supabase
 * @param code Code d'accès à vérifier
 * @returns Données du code d'accès ou null
 */
export async function verifyAccessCode(supabase: any, code: string) {
  try {
    const { data, error } = await supabase
      .from("document_access_codes")
      .select("id, user_id, document_id, is_full_access")
      .eq("access_code", code)
      .maybeSingle();

    if (error) {
      console.error("Erreur Supabase lors de la vérification du code:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Exception lors de la vérification du code d'accès:", err);
    return null;
  }
}

/**
 * Récupère les données du profil utilisateur
 * @param supabase Client Supabase
 * @param userId ID de l'utilisateur
 * @returns Données du profil ou null
 */
export async function fetchUserProfile(supabase: any, userId: string) {
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  return profileData;
}
