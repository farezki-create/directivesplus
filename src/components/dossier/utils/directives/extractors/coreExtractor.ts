
/**
 * Core functionality to extract directives from content
 */

/**
 * Extract directives from content using direct path lookups
 * @param decryptedContent The decrypted content to search
 * @returns Object containing directives and source if found
 */
export const extractDirectivesByPath = (decryptedContent: any) => {
  if (!decryptedContent) return null;
  
  // Chemins standardisés pour les systèmes médicaux (DMP, Radiologie, Mon Espace Santé)
  const paths = [
    // Chemins Mon Espace Santé
    ['directives_anticipees'],
    ['directives'],
    ['content', 'directives_anticipees'],
    ['content', 'directives'],
    // Chemins radiologie DICOM
    ['contenu', 'directives_anticipees'],
    ['contenu', 'directives'],
    ['meta', 'directives'],
    ['dicom', 'directives'],
    // Chemins DMP
    ['dossier', 'directives_anticipees'],
    ['dossier', 'directives'],
    ['dossier', 'contenu', 'directives'],
    // Chemins standards de documents médicaux
    ['document', 'directives_anticipees'],
    ['document', 'directives'],
    ['data', 'directives_anticipees'],
    ['data', 'directives'],
    // Chemins XML convertis
    ['xmlData', 'directives'],
    ['xml', 'directives']
  ];
  
  // Recherche par chemin direct (compatible systèmes radiologie/DMP)
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
    
    if (valid && obj) {
      return { directives: obj, source: path.join('.') };
    }
  }
  
  return null;
};
