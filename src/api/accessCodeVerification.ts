
import { supabase } from "@/integrations/supabase/client";

// Simplified MedicalDocument type
export interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  [key: string]: any;
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
  console.log(`Vérification du code ${accessCode} pour ${patientName} né(e) le ${patientBirthDate}`);

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
    console.error("Erreur lors de la vérification du code d'accès:", error);
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
    console.error("Erreur lors de la récupération des documents médicaux:", error);
    return [];
  }
};

// Define the type for dossier content to include document_url
interface DossierContent {
  patient: {
    nom: string;
    prenom: string;
    date_naissance: string;
  };
  document_url?: string; // Make document_url optional
}

// Define the type for the dossier data
interface DossierData {
  id: string;
  userId: string;
  isFullAccess: boolean;
  isDirectivesOnly: boolean;
  isMedicalOnly: boolean;
  profileData: any;
  contenu: DossierContent;
}

/**
 * Get authenticated user dossier without requiring an access code
 */
export const getAuthUserDossier = async (
  userId: string,
  documentType: "medical" | "directive" = "directive",
  documentPath?: string // Added optional document path parameter for direct document inclusion
): Promise<any> => {
  try {
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Create a dossier object for authenticated users with enhanced document support
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
          date_naissance: profile.birth_date || null,
        }
      }
    };
    
    // If a document path was provided, add it to the dossier content
    if (documentPath) {
      console.log("Adding document to dossier:", documentPath);
      dossierData.contenu.document_url = documentPath;
    }
    
    return {
      success: true,
      dossier: dossierData
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du dossier authentifié:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des données utilisateur"
    };
  }
};
