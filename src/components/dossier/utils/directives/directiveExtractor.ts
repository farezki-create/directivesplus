
import { extractDirectivesByPath } from "./extractors/coreExtractor";
import { extractDirectivesFromString } from "./extractors/stringParser";
import { searchDirectivesRecursively } from "./extractors/recursiveSearch";
import { createDirectivesMirror } from "./extractors/mirrorCreator";

/**
 * Extract directives from content with fallback strategies - based on medical imaging and health space systems
 */
export const extractDirectives = (
  decryptedContent: any, 
  hasDirectives: boolean,
  getDirectives?: () => any
) => {
  if (!hasDirectives && (!decryptedContent || Object.keys(decryptedContent).length === 0)) {
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
    // Essayer différentes méthodes d'extraction dans l'ordre
    const extractionMethods = [
      // Extraction par chemin direct
      () => extractDirectivesByPath(decryptedContent),
      
      // Extraction depuis une chaîne (JSON/XML)
      () => typeof decryptedContent === 'string' ? 
        extractDirectivesFromString(decryptedContent) : null,
      
      // Recherche récursive intelligente
      () => searchDirectivesRecursively(decryptedContent)
    ];

    // Appliquer chaque méthode d'extraction jusqu'à ce qu'une réussisse
    for (const method of extractionMethods) {
      const result = method();
      if (result) {
        directives = result.directives;
        source = result.source;
        console.log(`DirectivesTab - Directives trouvées dans ${source}:`, directives);
        break;
      }
    }
  }
  
  // 3. Créer une "image miroir" comme dernier recours
  if (!directives) {
    console.log("DirectivesTab - Aucune directive trouvée, création d'une image miroir");
    const result = createDirectivesMirror(decryptedContent);
    directives = result.directives;
    source = result.source;
  }
  
  console.log(`DirectivesTab - Affichage des directives depuis la source: ${source}`, directives);
  
  return { directives, source };
};
