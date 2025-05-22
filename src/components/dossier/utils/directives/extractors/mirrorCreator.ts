
/**
 * Create fallback directives when none can be extracted
 */

/**
 * Creates a "mirror" or fallback representation of directives when none can be found
 * @param decryptedContent The decrypted content to extract patient info from
 * @returns Object containing generated directives and source
 */
export const createDirectivesMirror = (decryptedContent: any) => {
  // Création d'un document standardisé basé sur le patient
  let patient = { nom: "Inconnu", prenom: "Inconnu" };
  
  // Chercher les infos du patient dans différents emplacements (format médical standard)
  if (decryptedContent) {
    if (decryptedContent.patient) {
      patient = decryptedContent.patient;
    } else if (decryptedContent.content?.patient) {
      patient = decryptedContent.content.patient;
    } else if (decryptedContent.contenu?.patient) {
      patient = decryptedContent.contenu.patient;
    } else if (decryptedContent.profileData) {
      patient = {
        nom: decryptedContent.profileData.last_name || "Inconnu",
        prenom: decryptedContent.profileData.first_name || "Inconnu"
      };
    } else if (decryptedContent.meta?.patient) {
      patient = decryptedContent.meta.patient;
    }
  }
  
  // Format standardisé des directives (similaire au DMP/Mon Espace Santé)
  const directives = {
    "Directives anticipées": `Directives anticipées pour ${patient.prenom} ${patient.nom}`,
    "Date de création": new Date().toLocaleDateString('fr-FR'),
    "Personne de confiance": "Non spécifiée",
    "Instructions": "Document disponible sur demande",
    "Remarque": "Ces directives sont une représentation simplifiée"
  };
  
  return { directives, source: "image miroir" };
};
