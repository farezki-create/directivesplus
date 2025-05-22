
/**
 * Debug utilities for directives - helpful for troubleshooting
 */

/**
 * Log directive debug information to console
 */
export const logDirectiveDebugInfo = (
  decryptedContent: any, 
  hasDirectives: boolean,
  getDirectives?: () => any
) => {
  console.group("Directives Debug Info");
  
  // Log content type and preview
  console.log("Content type:", typeof decryptedContent);
  if (typeof decryptedContent === 'object') {
    console.log("Content keys:", Object.keys(decryptedContent || {}));
    if (decryptedContent?.contenu) {
      console.log("Content.contenu keys:", Object.keys(decryptedContent.contenu || {}));
    }
    if (decryptedContent?.content) {
      console.log("Content.content keys:", Object.keys(decryptedContent.content || {}));
    }
  } else if (typeof decryptedContent === 'string') {
    console.log("Content preview:", decryptedContent.substring(0, 100) + "...");
  }
  
  // Log directives flag
  console.log("Has directives flag:", hasDirectives);
  
  // Try using getDirectives if available
  if (getDirectives) {
    try {
      const directives = getDirectives();
      console.log("GetDirectives result:", directives);
    } catch (error) {
      console.error("GetDirectives error:", error);
    }
  } else {
    console.log("GetDirectives function not available");
  }
  
  console.groupEnd();
};
