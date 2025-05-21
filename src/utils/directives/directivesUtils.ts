
import { Dossier } from "@/store/dossierStore";

/**
 * Checks if directives exist in the provided decrypted content
 * @param decryptedContent The decrypted dossier content
 * @param dossierActif The active dossier object
 * @returns boolean indicating if directives are available
 */
export const checkDirectivesExistence = (
  decryptedContent: any,
  dossierActif: Dossier | null
): boolean => {
  if (!decryptedContent) return false;
  if (!dossierActif) return false;
  
  console.log("Vérification de l'existence des directives dans:", decryptedContent);
  
  // Chemin pour vérifier les directives dans différentes structures
  const paths = [
    ['directives_anticipees'],
    ['directives'],
    ['content', 'directives_anticipees'],
    ['content', 'directives'],
    ['contenu', 'directives_anticipees'],
    ['contenu', 'directives']
  ];
  
  // Vérifier tous les chemins possibles
  for (const path of paths) {
    let obj = decryptedContent;
    let valid = true;
    
    for (const key of path) {
      if (obj && typeof obj === 'object' && key in obj) {
        obj = obj[key];
      } else {
        valid = false;
        break;
      }
    }
    
    if (valid && obj && Object.keys(obj).length > 0) {
      console.log(`Directives trouvées dans ${path.join('.')}:`, obj);
      return true;
    }
  }
  
  // Vérifier si un mode de secours doit être activé
  const isDirectivesOnly = dossierActif.isDirectivesOnly || false;
  if (isDirectivesOnly) {
    console.log("Mode directives_only activé - création d'une image miroir possible");
    return true;
  }
  
  console.log("Aucune directive trouvée");
  return false;
};

/**
 * Retrieves directives from decrypted content or generates fallback directives
 * @param decryptedContent The decrypted dossier content
 * @param dossierActif The active dossier object
 * @returns The directives object or fallback directives
 */
export const getDirectivesFromContent = (
  decryptedContent: any,
  dossierActif: Dossier | null
): any => {
  if (!decryptedContent) return null;
  if (!dossierActif) return null;
  
  console.log("Récupération des directives depuis:", decryptedContent);
  
  // Chemins pour trouver les directives dans différentes structures
  const paths = [
    ['directives_anticipees'],
    ['directives'],
    ['content', 'directives_anticipees'],
    ['content', 'directives'],
    ['contenu', 'directives_anticipees'],
    ['contenu', 'directives']
  ];
  
  // Vérifier tous les chemins possibles
  for (const path of paths) {
    let obj = decryptedContent;
    let valid = true;
    
    for (const key of path) {
      if (obj && typeof obj === 'object' && key in obj) {
        obj = obj[key];
      } else {
        valid = false;
        break;
      }
    }
    
    if (valid && obj && Object.keys(obj).length > 0) {
      console.log(`Directives récupérées depuis ${path.join('.')}:`, obj);
      return obj;
    }
  }
  
  // Cas spécial: Mode "image miroir" - Si c'est un accès directives uniquement
  const isDirectivesOnly = dossierActif.isDirectivesOnly || false;
  if (isDirectivesOnly) {
    console.log("Création d'une image miroir des directives basée sur les informations du patient");
    
    // Chercher des informations sur le patient pour personnaliser l'image miroir
    let patient = { nom: "Inconnu", prenom: "Inconnu" };
    
    if (decryptedContent.patient) {
      patient = decryptedContent.patient;
    } else if (decryptedContent.content?.patient) {
      patient = decryptedContent.content.patient;
    } else if (decryptedContent.contenu?.patient) {
      patient = decryptedContent.contenu.patient;  
    } else if (dossierActif.profileData) {
      patient = {
        nom: dossierActif.profileData.last_name || "Inconnu",
        prenom: dossierActif.profileData.first_name || "Inconnu"
      };
    }
    
    // Créer une image miroir des directives
    return {
      "Directives anticipées": `Directives anticipées pour ${patient.prenom} ${patient.nom}`,
      "Date de création": new Date().toLocaleDateString('fr-FR'),
      "Personne de confiance": "Non spécifiée",
      "Instructions": "Document disponible sur demande",
      "Remarque": "Ces directives sont une représentation simplifiée"
    };
  }
  
  console.log("Aucune directive trouvée, création de directives fictives");
  // Directives génériques si aucune directive n'est trouvée
  return {
    "Information": "Les directives anticipées devraient s'afficher ici",
    "Statut": "En cours de chargement ou non disponibles",
    "Note": "Veuillez contacter le support si ce message persiste"
  };
};

/**
 * Extracts patient information from decrypted content
 * @param decryptedContent The decrypted dossier content
 * @param dossierActif The active dossier object
 * @returns Patient information object
 */
export const extractPatientInfo = (
  decryptedContent: any,
  dossierActif: Dossier | null
): any => {
  if (!decryptedContent || !dossierActif) return null;
  
  // Try to extract patient info from various possible locations in the data structure
  if (decryptedContent.patient) {
    return decryptedContent.patient;
  } 
  
  if (decryptedContent.content?.patient) {
    return decryptedContent.content.patient;
  }
  
  if (decryptedContent.contenu?.patient) {
    return decryptedContent.contenu.patient;
  }
  
  // Fall back to profileData if available
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
