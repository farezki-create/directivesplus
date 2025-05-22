
import { extractDirectivesByPath } from "./extractors/coreExtractor";
import { extractDirectivesFromString } from "./extractors/stringParser";
import { searchDirectivesRecursively } from "./extractors/recursiveSearch";
import { createDirectivesMirror } from "./extractors/mirrorCreator";

/**
 * Extract directives from content with multiple fallback strategies
 * Based on medical imaging and health space systems for compatibility
 */
export const extractDirectives = (
  decryptedContent: any, 
  hasDirectives: boolean,
  getDirectives?: () => any
) => {
  console.log("extractDirectives starting with content:", decryptedContent);
  
  if (!hasDirectives && (!decryptedContent || Object.keys(decryptedContent || {}).length === 0)) {
    console.log("No content or directives to extract");
    return null;
  }

  // Récupération des directives avec fallback
  let directives = null;
  let source = "non définie";
  
  // 1. Essayer d'abord via la fonction getDirectives (méthode Mon Espace Santé)
  if (getDirectives) {
    try {
      directives = getDirectives();
      source = "fonction getDirectives";
      console.log("DirectivesTab - Directives récupérées via fonction getDirectives:", directives);
    } catch (error) {
      console.error("Erreur lors de l'appel à getDirectives:", error);
    }
  }
  
  // 2. Si toujours null, essayer via le contenu déchiffré avec extracteurs spécialisés
  if (!directives && decryptedContent) {
    console.log("Trying specialized extractors on decrypted content");
    
    // Gérer le cas où le contenu déchiffré est lui-même les directives
    if (typeof decryptedContent === 'object' && !Array.isArray(decryptedContent)) {
      const directiveKeywords = ['directive', 'anticipée', 'confiance', 'personne', 'instruction'];
      const keys = Object.keys(decryptedContent);
      
      if (keys.length < 10 && keys.some(key => 
        directiveKeywords.some(keyword => key.toLowerCase().includes(keyword)))) {
        directives = decryptedContent;
        source = "contenu_direct";
        console.log("Le contenu déchiffré semble être directement les directives");
      }
    }
    
    // Si toujours pas trouvé, essayer différentes méthodes d'extraction dans l'ordre
    if (!directives) {
      const extractionMethods = [
        // Extraction par chemin direct
        () => {
          console.log("Trying extraction by direct path");
          return extractDirectivesByPath(decryptedContent);
        },
        
        // Extraction depuis une chaîne (JSON/XML)
        () => {
          if (typeof decryptedContent === 'string') {
            console.log("Trying extraction from string content");
            return extractDirectivesFromString(decryptedContent);
          }
          return null;
        },
        
        // Recherche récursive intelligente
        () => {
          console.log("Trying recursive search");
          return searchDirectivesRecursively(decryptedContent);
        }
      ];

      // Appliquer chaque méthode d'extraction jusqu'à ce qu'une réussisse
      for (const method of extractionMethods) {
        const result = method();
        if (result) {
          directives = result.directives;
          source = result.source;
          console.log(`DirectivesTab - Directives found in ${source}:`, directives);
          break;
        }
      }
    }
  }
  
  // 3. Créer une "image miroir" comme dernier recours
  if (!directives) {
    console.log("No directives found, creating mirror image");
    const result = createDirectivesMirror(decryptedContent);
    directives = result.directives;
    source = result.source;
  }
  
  console.log(`DirectivesTab - Final directives from source: ${source}`, directives);
  
  return { directives, source };
};
