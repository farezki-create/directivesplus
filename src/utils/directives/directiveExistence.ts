
import { Dossier } from "@/store/dossierStore";

/**
 * Checks if directives exist in the provided decrypted content
 * Méthode inspirée de l'analyse des documents médicaux (DMP/Mon Espace Santé)
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
  
  // Chemins standardisés pour vérifier les directives (compatible Mon Espace Santé et DMP)
  const paths = [
    ['directives_anticipees'],
    ['directives'],
    ['content', 'directives_anticipees'],
    ['content', 'directives'],
    ['contenu', 'directives_anticipees'],
    ['contenu', 'directives'],
    ['meta', 'directives'],
    ['dicom', 'directives'],
    ['dossier', 'directives'],
    ['document', 'directives']
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
      console.log(`Directives trouvées dans ${path.join('.')}:`, obj);
      return true;
    }
  }
  
  // Vérifier mode directives_only (comme fonctionnalité spécifique DMP)
  const isDirectivesOnly = dossierActif.isDirectivesOnly || false;
  if (isDirectivesOnly) {
    console.log("Mode directives_only activé - création d'une image miroir possible");
    return true;
  }
  
  console.log("Aucune directive trouvée");
  return false;
};
