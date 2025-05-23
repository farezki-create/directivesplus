
import { supabase } from "@/integrations/supabase/client";
import type { Dossier } from "@/hooks/types/dossierTypes";

/**
 * Verifies access code against the backend using RPC when possible
 */
export const verifyAccessCode = async (
  accessCode: string,
  patientName: string,
  patientBirthDate: string,
  documentType: "medical" | "directive" = "directive"
) => {
  console.log(`Verifying code ${accessCode} for ${patientName} né(e) le ${patientBirthDate}`);

  // Parse patientName into first and last name if possible
  let firstName = "", lastName = "";
  if (patientName.includes(" ")) {
    const nameParts = patientName.split(" ");
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(" ");
  }

  const bruteForceIdentifier = `${documentType}_access_${patientName}_${patientBirthDate}`;
  
  try {
    // First try with RPC if we have both names
    if (firstName && lastName) {
      const result = await verifyWithRPC(firstName, lastName, patientBirthDate, accessCode, documentType);
      if (result) return result;
    }
    
    // Fallback to Edge Function
    return await verifyWithEdgeFunction(accessCode, patientName, patientBirthDate, bruteForceIdentifier);
  } catch (error) {
    console.error("Error verifying access code:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la communication avec le serveur"
    };
  }
};

/**
 * Verify access using RPC function
 */
async function verifyWithRPC(firstName: string, lastName: string, birthDate: string, accessCode: string, documentType: string) {
  console.log(`Attempting RPC verification with firstName=${firstName}, lastName=${lastName}, birthdate=${birthDate}`);
  
  // Convert birthdate string to Date object if provided
  let birthDateObj = null;
  if (birthDate) {
    try {
      birthDateObj = new Date(birthDate);
    } catch (e) {
      console.error("Invalid birthdate format:", e);
    }
  }

  const { data: profiles, error: rpcError } = await supabase.rpc(
    'verify_access_identity',
    {
      input_lastname: lastName,
      input_firstname: firstName,
      input_birthdate: birthDateObj,
      input_access_code: accessCode,
    }
  );
  
  if (rpcError) {
    console.error("RPC verification error:", rpcError);
    return null;
  } 
  
  if (profiles && profiles.length > 0) {
    console.log("RPC verification successful:", profiles);
    
    // Create dossier from the profile
    const profile = profiles[0];
    return {
      success: true,
      dossier: {
        id: profile.id,
        userId: profile.user_id,
        isFullAccess: true,
        isDirectivesOnly: documentType === "directive",
        isMedicalOnly: documentType === "medical",
        profileData: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          birth_date: profile.birthdate
        },
        contenu: {
          patient: {
            nom: profile.last_name,
            prenom: profile.first_name,
            date_naissance: profile.birthdate
          }
        }
      }
    };
  }
  
  return null;
}

/**
 * Verify access using Edge function
 */
async function verifyWithEdgeFunction(accessCode: string, patientName: string, patientBirthDate: string, bruteForceIdentifier: string) {
  console.log("Falling back to Edge Function verification");
  
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

  if (!response.ok) {
    console.error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  console.log("Edge function verification result:", result);
  return result;
}
