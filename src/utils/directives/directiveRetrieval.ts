
import { Dossier } from "@/store/dossierStore";

/**
 * Récupère les directives depuis le contenu décrypté ou génère des directives de secours
 * Implémentation inspirée des méthodes d'extraction de Mon Espace Santé
 * @param decryptedContent Le contenu décrypté du dossier
 * @param dossierActif L'objet dossier actif
 * @returns L'objet directives ou des directives de secours
 */
export const getDirectivesFromContent = (
  decryptedContent: any,
  dossierActif: Dossier | null
): any => {
  if (!decryptedContent) return null;
  if (!dossierActif) return null;
  
  console.log("Récupération des directives depuis:", decryptedContent);
  
  // Vérifier d'abord si nous sommes dans un affichage exclusif de directives
  if (dossierActif.isDirectivesOnly) {
    console.log("Mode d'affichage exclusif des directives");
  }
  
  // Chemins standardisés pour toutes les sources de données possibles
  const paths = [
    ['directives_anticipees'],
    ['directives'],
    ['directive_anticipee'],
    ['directive'],
    ['content', 'directives_anticipees'],
    ['content', 'directives'],
    ['contenu', 'directives_anticipees'],
    ['contenu', 'directives'],
    ['patient', 'directives_anticipees'],
    ['patient', 'directives'],
    ['meta', 'directives'],
    ['dicom', 'directives'],
    ['dossier', 'directives_anticipees'],
    ['dossier', 'directives'],
    ['dossier', 'contenu', 'directives'],
    ['document', 'directives_anticipees'],
    ['document', 'directives'],
    ['data', 'directives_anticipees'],
    ['data', 'directives'],
    ['xmlData', 'directives'],
    ['xml', 'directives']
  ];
  
  // Vérifier tous les chemins standardisés
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
    
    if (valid && obj && (typeof obj === 'object' ? Object.keys(obj).length > 0 : true)) {
      console.log(`Directives récupérées depuis ${path.join('.')}:`, obj);
      return obj;
    }
  }
  
  // Vérification si l'objet racine est directement les directives
  if (decryptedContent && typeof decryptedContent === 'object') {
    const directiveIndicators = ['Directives anticipées', 'Date de création', 'Personne de confiance', 'Instructions'];
    let indicatorCount = 0;
    
    for (const indicator of directiveIndicators) {
      if (Object.keys(decryptedContent).some(key => key.includes(indicator))) {
        indicatorCount++;
      }
    }
    
    // Si l'objet racine a suffisamment d'indicateurs de directives
    if (indicatorCount >= 2) {
      console.log("L'objet racine contient directement les directives");
      return decryptedContent;
    }
  }
  
  // Cas spécial: Mode "image miroir" (Format Mon Espace Santé)
  const isDirectivesOnly = dossierActif.isDirectivesOnly || false;
  if (isDirectivesOnly) {
    console.log("Création d'une image miroir des directives basée sur les informations du patient");
    
    // Chercher des informations sur le patient avec format standard médical
    let patient = { nom: "Inconnu", prenom: "Inconnu" };
    
    if (decryptedContent.patient) {
      patient = decryptedContent.patient;
    } else if (decryptedContent.content?.patient) {
      patient = decryptedContent.content.patient;
    } else if (decryptedContent.contenu?.patient) {
      patient = decryptedContent.contenu.patient;  
    } else if (decryptedContent.meta?.patient) {
      patient = decryptedContent.meta.patient;
    } else if (dossierActif.profileData) {
      patient = {
        nom: dossierActif.profileData.last_name || "Inconnu",
        prenom: dossierActif.profileData.first_name || "Inconnu"
      };
    }
    
    // Créer une image miroir des directives (format standard médical)
    return {
      "Directives anticipées": `Directives anticipées pour ${patient.prenom} ${patient.nom}`,
      "Date de création": new Date().toLocaleDateString('fr-FR'),
      "Personne de confiance": "Non spécifiée",
      "Instructions": "Document disponible sur demande",
      "Remarque": "Ces directives sont une représentation simplifiée"
    };
  }
  
  console.log("Aucune directive trouvée, création de directives fictives");
  // Directives génériques de secours
  return {
    "Information": "Les directives anticipées devraient s'afficher ici",
    "Statut": "En cours de chargement ou non disponibles",
    "Note": "Veuillez contacter le support si ce message persiste"
  };
};
