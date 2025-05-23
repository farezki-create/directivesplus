
import { supabase } from "@/integrations/supabase/client";
import { Dossier } from "@/hooks/useVerifierCodeAcces";

/**
 * Get authenticated user's medical dossier
 * @param userId User ID to get dossier for
 * @param accessType Type of access (medical or directive)
 * @param documentPath Optional document path to include
 * @param documentsList Optional documents list to include
 * @returns Object with success status and dossier or error
 */
export const getAuthUserDossier = async (
  userId: string, 
  accessType: "medical" | "directive" = "medical",
  documentPath?: string,
  documentsList?: any[]
) => {
  try {
    console.log(`Getting ${accessType} dossier for user ID:`, userId);
    
    // First try to get the user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Error getting user profile:", profileError);
      return {
        success: false,
        error: "Failed to get user profile"
      };
    }

    console.log("Profile data loaded directly:", profile);
    
    // Create a dossier from the profile data
    const dossier: Dossier = {
      id: `auth-${Date.now()}`,
      userId: userId,
      isFullAccess: true,
      isDirectivesOnly: accessType === "directive",
      isMedicalOnly: accessType === "medical",
      profileData: profile || {
        first_name: "Utilisateur",
        last_name: "Non identifié",
        birth_date: null
      },
      contenu: {
        // Add document URL if provided
        ...(documentPath ? { document_url: documentPath } : {}),
        // Add document list if provided
        ...(documentsList && documentsList.length > 0 ? { documents: documentsList } : {})
      }
    };
    
    // Add patient information to the contenu object
    if (profile) {
      // Create a copy of contenu with patient information
      dossier.contenu = {
        ...dossier.contenu,
        patient: {
          nom: profile.last_name || "Inconnu",
          prenom: profile.first_name || "Inconnu",
          date_naissance: profile.birth_date || null,
        }
      };
    }
    
    console.log("Dossier créé pour utilisateur authentifié:", dossier);
    
    return {
      success: true,
      dossier
    };
  } catch (error) {
    console.error("Error getting authenticated user dossier:", error);
    return {
      success: false,
      error: "Failed to get dossier"
    };
  }
};
