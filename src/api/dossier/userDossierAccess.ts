
import { supabase } from "@/integrations/supabase/client";
import { Dossier } from "@/hooks/types/dossierTypes";

/**
 * Get authenticated user dossier without requiring an access code
 */
export const getAuthUserDossier = async (
  userId: string,
  documentType: "medical" | "directive" = "directive"
): Promise<{ success: boolean; dossier?: Dossier; error?: string }> => {
  try {
    console.log("getAuthUserDossier called with:", { userId, documentType });
    
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error retrieving profile:", profileError);
      throw profileError;
    }
    
    if (!profile) {
      console.error("No profile found for user:", userId);
      return {
        success: false,
        error: "Profil utilisateur non trouvé"
      };
    }
    
    console.log("User profile retrieved:", profile);
    
    // Get user's documents
    const { data: documents, error: docsError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (docsError) {
      console.error("Error fetching documents:", docsError);
    }
    
    // Create a dossier object for authenticated users
    const dossierData: Dossier = {
      id: `auth-${Date.now()}`,
      userId: userId,
      isFullAccess: true,
      isDirectivesOnly: documentType === "directive",
      isMedicalOnly: documentType === "medical",
      profileData: profile,
      contenu: {
        documents: documents || [],
        patient: {
          nom: profile.last_name || "Inconnu",
          prenom: profile.first_name || "Inconnu",
          date_naissance: profile.birth_date || null,
        }
      }
    };
    
    console.log("Dossier created for authenticated user:", dossierData);
    
    return {
      success: true,
      dossier: dossierData
    };
  } catch (error) {
    console.error("Error getting authenticated user dossier:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des données utilisateur"
    };
  }
};
