
/**
 * Log directive debugging information to the console
 */
export const logDirectiveDebugInfo = (
  decryptedContent: any, 
  hasDirectives: boolean, 
  getDirectives?: () => any
) => {
  console.log("DirectivesTab - Rendered with:", { 
    hasContent: !!decryptedContent, 
    hasDirectives, 
    hasGetDirectives: !!getDirectives,
    contentType: typeof decryptedContent
  });
  
  if (getDirectives) {
    try {
      const directives = getDirectives();
      console.log("DirectivesTab - Directives récupérées via getDirectives:", directives);
    } catch (error) {
      console.error("DirectivesTab - Erreur lors de la récupération des directives:", error);
    }
  }

  // Additional diagnostic logging
  if (decryptedContent) {
    console.log("DirectivesTab - Structure du contenu déchiffré:", 
      Object.keys(decryptedContent).join(', '));
    
    // Check for common paths where directives might be stored
    const paths = [
      'directives', 
      'directives_anticipees', 
      'content.directives',
      'content.directives_anticipees',
      'contenu.directives',
      'contenu.directives_anticipees',
      'dossier.directives',
      'dossier.directives_anticipees',
      'document.directives',
      'document.directives_anticipees'
    ];
    
    paths.forEach(path => {
      const parts = path.split('.');
      let obj = decryptedContent;
      let exists = true;
      
      for (const part of parts) {
        if (obj && typeof obj === 'object' && part in obj) {
          obj = obj[part];
        } else {
          exists = false;
          break;
        }
      }
      
      if (exists) {
        console.log(`DirectivesTab - Trouvé directives dans: ${path}`, obj);
      }
    });
  }
};
