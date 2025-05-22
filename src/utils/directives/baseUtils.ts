
import { Dossier } from "@/store/dossierStore";

/**
 * Extracts patient information from decrypted content
 * Format compatible avec les systèmes de santé standard
 * @param decryptedContent The decrypted dossier content
 * @param dossierActif The active dossier object
 * @returns Patient information object
 */
export const extractPatientInfo = (
  decryptedContent: any,
  dossierActif: Dossier | null
): any => {
  if (!decryptedContent || !dossierActif) return null;
  
  // Extraction du patient avec chemins standardisés (DMP/Mon Espace Santé)
  if (decryptedContent.patient) {
    return decryptedContent.patient;
  } 
  
  if (decryptedContent.content?.patient) {
    return decryptedContent.content.patient;
  }
  
  if (decryptedContent.contenu?.patient) {
    return decryptedContent.contenu.patient;
  }
  
  if (decryptedContent.meta?.patient) {
    return decryptedContent.meta.patient;
  }
  
  if (decryptedContent.dossier?.patient) {
    return decryptedContent.dossier.patient;
  }
  
  // Fallback sur profileData (format standard)
  if (dossierActif.profileData) {
    return {
      nom: dossierActif.profileData.last_name,
      prenom: dossierActif.profileData.first_name,
      date_naissance: dossierActif.profileData.birth_date,
      adresse: dossierActif.profileData.address,
      telephone: dossierActif.profileData.phone_number
    };
  }
  
  return null;
};
