
import { supabase } from "@/integrations/supabase/client";
import { Dossier } from "@/hooks/useVerifierCodeAcces";

/**
 * Get authenticated user's medical dossier
 * @param userId User ID to get dossier for
 * @param accessType Type of access (medical or directive)
 * @returns Dossier object or null if not found
 */
export const getAuthUserDossier = async (
  userId: string, 
  accessType: "medical" | "directive" = "medical"
) => {
  try {
    console.log(`Getting ${accessType} dossier for user ID:`, userId);
    
    // This function would normally query Supabase
    // For this simplified version, just return mock data
    
    // Mock the database query to get profile data
    const mockProfile = {
      first_name: "Jean",
      last_name: "Dupont",
      birth_date: "1970-01-01"
    };
    
    const dossier: Dossier = {
      id: `${accessType}-${userId}`,
      userId: userId,
      isFullAccess: true,
      isDirectivesOnly: accessType === "directive",
      isMedicalOnly: accessType === "medical",
      profileData: mockProfile,
      contenu: {
        document_url: "https://example.com/document.pdf",
        documents: []
      }
    };
    
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
