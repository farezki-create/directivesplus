
import { Dossier } from "@/store/dossierStore";

/**
 * Extract patient information from decrypted content
 * @param decryptedContent The decrypted content
 * @param dossierActif The active dossier object
 * @returns Patient information object
 */
export const extractPatientInfo = (
  decryptedContent: any,
  dossierActif: Dossier | null = null
) => {
  console.log("Extracting patient info from:", decryptedContent);
  
  // Default patient info
  const defaultInfo = {
    firstName: "Prénom",
    lastName: "Nom",
    birthDate: null,
    gender: null
  };
  
  if (!decryptedContent && !dossierActif) {
    return defaultInfo;
  }
  
  try {
    // Try to get patient info from profile data in dossier
    if (dossierActif?.profileData) {
      return {
        firstName: dossierActif.profileData.first_name || defaultInfo.firstName,
        lastName: dossierActif.profileData.last_name || defaultInfo.lastName,
        birthDate: dossierActif.profileData.birth_date || defaultInfo.birthDate,
        gender: dossierActif.profileData.gender || defaultInfo.gender
      };
    }
    
    // Try common data paths
    if (decryptedContent.patient) {
      return {
        firstName: decryptedContent.patient.prenom || decryptedContent.patient.first_name || defaultInfo.firstName,
        lastName: decryptedContent.patient.nom || decryptedContent.patient.last_name || defaultInfo.lastName,
        birthDate: decryptedContent.patient.date_naissance || decryptedContent.patient.birth_date || defaultInfo.birthDate,
        gender: decryptedContent.patient.sexe || decryptedContent.patient.gender || defaultInfo.gender
      };
    } 
    
    if (decryptedContent.content?.patient) {
      const patient = decryptedContent.content.patient;
      return {
        firstName: patient.prenom || patient.first_name || defaultInfo.firstName,
        lastName: patient.nom || patient.last_name || defaultInfo.lastName,
        birthDate: patient.date_naissance || patient.birth_date || defaultInfo.birthDate,
        gender: patient.sexe || patient.gender || defaultInfo.gender
      };
    }
    
    // Try direct properties
    if (decryptedContent.first_name || decryptedContent.last_name) {
      return {
        firstName: decryptedContent.first_name || defaultInfo.firstName,
        lastName: decryptedContent.last_name || defaultInfo.lastName,
        birthDate: decryptedContent.birth_date || defaultInfo.birthDate,
        gender: decryptedContent.gender || defaultInfo.gender
      };
    }
    
    if (decryptedContent.prenom || decryptedContent.nom) {
      return {
        firstName: decryptedContent.prenom || defaultInfo.firstName,
        lastName: decryptedContent.nom || defaultInfo.lastName,
        birthDate: decryptedContent.date_naissance || defaultInfo.birthDate,
        gender: decryptedContent.sexe || defaultInfo.gender
      };
    }
  } catch (error) {
    console.error("Error extracting patient info:", error);
  }
  
  return defaultInfo;
};
