
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
      
      // Création d'un profil minimal en cas d'erreur pour éviter un échec complet
      return {
        id: userId,
        first_name: "Utilisateur",
        last_name: "Non identifié",
        birth_date: null
      };
    }
    
    if (!profileData) {
      console.log("Aucun profil trouvé, création d'un profil minimal");
      
      // Création d'un profil minimal pour éviter un échec complet de l'accès
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
    
    // Même en cas d'erreur, on renvoie un profil minimal pour permettre l'accès
    return {
      id: userId,
      first_name: "Utilisateur",
      last_name: "Non identifié",
      birth_date: null
    };
  }
}
