
import { supabase } from "@/integrations/supabase/client";
import type { Dossier } from "@/hooks/types/dossierTypes";

/**
 * Get authenticated user dossier without requiring an access code
 */
export const getAuthUserDossier = async (
  userId: string,
  documentType: "medical" | "directive" = "directive",
  documentPath?: string,
  documentsList?: any[]
): Promise<{ success: boolean; dossier?: Dossier; error?: string }> => {
  try {
    console.log("getAuthUserDossier called with:", { userId, documentType, documentPath, hasDocumentsList: !!documentsList });
    
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Error retrieving profile:", profileError);
      throw profileError;
    }
    
    console.log("User profile retrieved:", profile);
    
    // Create a dossier object for authenticated users with enhanced document support
    const dossierData: Dossier = {
      id: `auth-${Date.now()}`,
      userId: userId,
      isFullAccess: true,
      isDirectivesOnly: documentType === "directive",
      isMedicalOnly: documentType === "medical",
      profileData: profile,
      contenu: {
        patient: {
          nom: profile.last_name || "Inconnu",
          prenom: profile.first_name || "Inconnu",
          date_naissance: profile.birth_date || null,
        }
      }
    };
    
    // Add document URL if provided
    if (documentPath) {
      console.log("Adding document to dossier:", documentPath);
      dossierData.contenu.document_url = documentPath;
    }
    
    // Add document list if provided
    if (documentsList && documentsList.length > 0) {
      console.log("Adding document list to dossier:", documentsList);
      dossierData.contenu.documents = documentsList;
    }
    
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
