
/**
 * Creates a mirror representation of directives when none can be found
 */
export const createDirectivesMirror = (decryptedContent: any) => {
  console.log("Creating mirror directives from content:", decryptedContent);
  
  // Get patient info from any available source
  const patientInfo = extractPatientInfo(decryptedContent);
  
  // Create a mirror representation based on found patient info
  const directives = {
    "Directives anticipées": `Directives anticipées pour ${patientInfo.firstName} ${patientInfo.lastName}`,
    "Date de création": new Date().toLocaleDateString('fr-FR'),
    "Personne de confiance": "Non spécifiée",
    "Remarques": "Ce document est une représentation simplifiée de vos directives anticipées",
    "Instructions": "Document complet disponible sur demande auprès du titulaire du dossier"
  };
  
  return { directives, source: "image miroir" };
};

/**
 * Extract patient information from any source in the content
 */
const extractPatientInfo = (content: any): { firstName: string; lastName: string } => {
  let firstName = "Prénom";
  let lastName = "Nom";
  
  if (!content) return { firstName, lastName };
  
  try {
    // Try to find patient info in common structures
    if (content.patient) {
      firstName = content.patient.prenom || content.patient.first_name || firstName;
      lastName = content.patient.nom || content.patient.last_name || lastName;
    } 
    else if (content.content?.patient) {
      firstName = content.content.patient.prenom || content.content.patient.first_name || firstName;
      lastName = content.content.patient.nom || content.content.patient.last_name || lastName;
    }
    else if (content.contenu?.patient) {
      firstName = content.contenu.patient.prenom || content.contenu.patient.first_name || firstName;
      lastName = content.contenu.patient.nom || content.contenu.patient.last_name || lastName;
    }
    else if (content.profileData) {
      firstName = content.profileData.first_name || firstName;
      lastName = content.profileData.last_name || lastName;
    }
    else if (content.meta?.patient) {
      firstName = content.meta.patient.prenom || content.meta.patient.first_name || firstName;
      lastName = content.meta.patient.nom || content.meta.patient.last_name || lastName;
    }
    else if (content.nom && content.prenom) {
      firstName = content.prenom;
      lastName = content.nom;
    }
    else if (content.first_name && content.last_name) {
      firstName = content.first_name;
      lastName = content.last_name;
    }
  } catch (e) {
    console.error("Error extracting patient info:", e);
  }
  
  return { firstName, lastName };
};
