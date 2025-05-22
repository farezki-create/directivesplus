
/**
 * Recursively search for directives in nested objects
 */

/**
 * Recursively searches for directives in complex nested objects
 * @param decryptedContent The content to search
 * @returns Object containing directives and source if found
 */
export const searchDirectivesRecursively = (decryptedContent: any) => {
  if (!decryptedContent || typeof decryptedContent !== 'object') return null;
  
  console.log("searchDirectivesRecursively analyzing object");
  
  const searchForDirectives = (obj: any, path: string = 'root'): any => {
    if (!obj || typeof obj !== 'object') return null;
    
    // Termes médicaux standardisés (compatible avec terminologies médicales)
    const indicativeKeys = [
      'directive', 'anticipe', 'medical', 'soin', 'patient', 'health',
      'care', 'instruction', 'wish', 'preference', 'decision', 'consent',
      'traitement', 'volonte', 'fin', 'vie', 'reanimation', 'resuscitation',
      'personne', 'confiance'
    ];
    
    // Vérifier si l'objet semble contenir des directives (comme analyse DICOM)
    const hasIndicativeKeys = Object.keys(obj).some(key => 
      indicativeKeys.some(term => key.toLowerCase().includes(term))
    );
    
    if (hasIndicativeKeys) {
      console.log(`Found directive-like object at path: ${path}`, Object.keys(obj));
      return { directives: obj, source: path };
    }
    
    // Recherche récursive inspirée des systèmes d'analyse d'image médicale
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        const found = searchForDirectives(obj[key], `${path}.${key}`);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  const result = searchForDirectives(decryptedContent);
  if (result) {
    console.log("Recursive search found directives at:", result.source);
  }
  return result;
};
