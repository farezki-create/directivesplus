
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
  
  // Debug the incoming content
  console.log("extractDirectivesByPath analyzing:", typeof decryptedContent);
  
  // Chemins standardisés pour les systèmes médicaux (DMP, Radiologie, Mon Espace Santé)
  const paths = [
    // Chemins Mon Espace Santé
    ['directives_anticipees'],
    ['directives'],
    ['directives_anticipee'], // Variation possible
    ['directive'], // Variation possible
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
  
  // Vérifier s'il s'agit directement d'un objet de directives
  if (typeof decryptedContent === 'object' && !Array.isArray(decryptedContent)) {
    const directiveKeywords = ['directives', 'anticipees', 'patient', 'confiance', 'medical'];
    
    // Si l'objet a moins de 10 clés et contient des mots-clés associés aux directives, c'est probablement un objet de directives
    const keys = Object.keys(decryptedContent);
    if (keys.length < 10 && keys.some(key => 
      directiveKeywords.some(keyword => key.toLowerCase().includes(keyword))
    )) {
      console.log("Objet de directive trouvé directement:", keys);
      return { directives: decryptedContent, source: "objet_direct" };
    }
  }
  
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
      console.log(`Directives trouvées via chemin: ${path.join('.')}:`, obj);
      return { directives: obj, source: path.join('.') };
    }
  }
  
  return null;
};
