
/**
 * Service for managing user profiles
 */

/**
 * Fetch user profile data from Supabase
 * @param supabase Supabase client
 * @param userId User ID
 * @returns User profile data
 */
export async function fetchUserProfile(supabase: any, userId: string) {
  if (!userId) {
    throw new Error("ID utilisateur manquant");
  }
  
  console.log(`Récupération du profil pour l'utilisateur: ${userId}`);
  
  try {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Erreur lors de la récupération du profil:", profileError);
      throw new Error(`Erreur lors de la récupération du profil: ${profileError.message}`);
    }
    
    if (!profileData) {
      console.error("Profil utilisateur non trouvé");
      throw new Error("Profil utilisateur non trouvé");
    }
    
    return profileData;
  } catch (error: any) {
    console.error("Exception lors de la récupération du profil:", error);
    throw new Error(`Échec de la récupération du profil: ${error.message}`);
  }
}
