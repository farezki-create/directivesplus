
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
      
      // Create a minimal profile in case of error to avoid complete failure
      return {
        id: userId,
        first_name: "Utilisateur",
        last_name: "Non identifié",
        birth_date: null
      };
    }
    
    if (!profileData) {
      console.log("Aucun profil trouvé, création d'un profil minimal");
      
      // Create a minimal profile to avoid complete failure of access
      return {
        id: userId,
        first_name: "Utilisateur",
        last_name: "Non identifié",
        birth_date: null
      };
    }
    
    return profileData;
  } catch (error: any) {
    console.error("Exception lors de la récupération du profil:", error);
    
    // Even in case of error, return a minimal profile to allow access
    return {
      id: userId,
      first_name: "Utilisateur",
      last_name: "Non identifié",
      birth_date: null
    };
  }
}
