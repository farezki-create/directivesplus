
import { supabase } from "@/integrations/supabase/client";

// Simplified MedicalDocument type
export interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  [key: string]: any;
}

// Define the type for dossier content to include document_url
export interface DossierContent {
  patient?: {
    nom: string;
    prenom: string;
    date_naissance: string;
  };
  document_url?: string;
  document_name?: string;
  [key: string]: any;
}

// Define the type for the dossier data
export interface DossierData {
  id: string;
  userId: string;
  isFullAccess: boolean;
  isDirectivesOnly: boolean;
  isMedicalOnly: boolean;
  profileData: any;
  contenu: DossierContent;
}

/**
 * Verifies access code against the backend
 */
export const verifyAccessCode = async (
  accessCode: string,
  patientName: string,
  patientBirthDate: string,
  documentType: "medical" | "directive" = "directive"
) => {
  console.log(`[API] Vérification du code ${accessCode} pour ${patientName}`);

  const bruteForceIdentifier = `${documentType}_access_${patientName}_${patientBirthDate}`;
  
  try {
    // Appel à la fonction Edge verifierCodeAcces
    const response = await fetch(`https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessCode,
        patientName,
        patientBirthDate,
        bruteForceIdentifier
      })
    });

    return await response.json();
  } catch (error) {
    console.error("[API] Erreur vérification code:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la communication avec le serveur"
    };
  }
};

/**
 * Fetches medical documents for a user
 */
export const getMedicalDocuments = async (userId: string): Promise<MedicalDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as MedicalDocument[];
  } catch (error) {
    console.error("[API] Erreur récupération documents:", error);
    return [];
  }
};

/**
 * Get authenticated user dossier without requiring an access code
 * Works with direct document links
 */
export const getAuthUserDossier = async (
  userId: string,
  documentType: "medical" | "directive" = "directive",
  documentPath?: string
): Promise<any> => {
  try {
    console.log("[API] getAuthUserDossier appelé avec:", { userId, documentType, documentPath });
    
    // If document path is provided, create a direct document dossier
    if (documentPath) {
      console.log("[API] Création dossier direct avec document:", documentPath);
      
      const directDossier: DossierData = {
        id: `direct-document-${Date.now()}`,
        userId: userId,
        isFullAccess: true,
        isDirectivesOnly: documentType === "directive",
        isMedicalOnly: documentType === "medical",
        profileData: null,
        contenu: {
          document_url: documentPath,
          document_name: documentPath.split('/').pop() || "document",
          patient: {
            nom: "Document",
            prenom: "Partagé",
            date_naissance: new Date().toISOString().split('T')[0],
          }
        }
      };
      
      return {
        success: true,
        dossier: directDossier
      };
    }
    
    // Fetch user profile for regular dossier
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("[API] Erreur récupération profil:", profileError);
      throw profileError;
    }
    
    // Create a dossier object for authenticated users
    const dossierData: DossierData = {
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
          date_naissance: profile.birth_date || new Date().toISOString().split('T')[0],
        }
      }
    };
    
    // If a document path was provided, add it to the dossier content
    if (documentPath) {
      console.log("[API] Ajout document au dossier:", documentPath);
      dossierData.contenu.document_url = documentPath;
      dossierData.contenu.document_name = documentPath.split('/').pop() || "document";
    }
    
    return {
      success: true,
      dossier: dossierData
    };
  } catch (error) {
    console.error("[API] Erreur récupération dossier authentifié:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des données utilisateur"
    };
  }
};
