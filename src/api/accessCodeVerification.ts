
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
