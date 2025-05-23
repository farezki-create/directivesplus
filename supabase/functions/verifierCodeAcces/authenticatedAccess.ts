
import { fetchUserProfile } from "./profileService.ts";
import { determineAccessType } from "./accessTypeUtils.ts";
import { StandardResponse } from "./types.ts";

/**
 * Get authenticated user dossier without requiring an access code
 * @param supabase Supabase client
 * @param userId User ID
 * @param accessType Optional access type specification
 * @returns Standard response with dossier if successful
 */
export async function getAuthenticatedUserDossier(
  supabase: any,
  userId: string,
  accessType?: string
): Promise<StandardResponse> {
  try {
    console.log("getAuthenticatedUserDossier called with:", { userId, accessType });
    
    // Get user profile
    const profileData = await fetchUserProfile(supabase, userId);
    if (!profileData) {
      console.error("Error fetching profile for user:", userId);
      return {
        success: false,
        error: "Profil utilisateur non trouvé"
      };
    }
    
    console.log("User profile retrieved:", profileData);
    
    // Get user's documents
    const { data: documents, error: docsError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (docsError) {
      console.error("Error fetching documents:", docsError);
    }
    
    // Determine access type
    const accessTypeInfo = accessType ? 
      determineAccessType(accessType) : 
      { isDirectivesOnly: false, isMedicalOnly: false };
    
    // Create dossier
    const dossier = {
      id: `auth-${Date.now()}`,
      userId: userId,
      isFullAccess: true,
      isDirectivesOnly: accessTypeInfo.isDirectivesOnly,
      isMedicalOnly: accessTypeInfo.isMedicalOnly,
      profileData: profileData,
      contenu: {
        documents: documents || [],
        patient: {
          nom: profileData?.last_name || "Inconnu",
          prenom: profileData?.first_name || "Inconnu",
          date_naissance: profileData?.birth_date || null,
        }
      }
    };
    
    console.log("Created dossier for authenticated user:", JSON.stringify(dossier, null, 2));
    
    return {
      success: true,
      dossier: dossier
    };
  } catch (error) {
    console.error("Error in getAuthenticatedUserDossier:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des données utilisateur"
    };
  }
}
