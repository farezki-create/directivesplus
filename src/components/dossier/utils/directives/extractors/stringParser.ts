
/**
 * Extract directives from string content
 */
export const extractDirectivesFromString = (stringContent: string) => {
  if (!stringContent || typeof stringContent !== 'string') return null;
  
  console.log("Extracting directives from string content:", stringContent.substring(0, 100) + "...");
  
  try {
    // Try parsing as JSON
    try {
      const jsonContent = JSON.parse(stringContent);
      if (jsonContent) {
        // Check for directives in parsed JSON
        if (jsonContent.directives) {
          return { directives: jsonContent.directives, source: "json.directives" };
        }
        if (jsonContent.directives_anticipees) {
          return { directives: jsonContent.directives_anticipees, source: "json.directives_anticipees" };
        }
        
        // Try common paths
        if (jsonContent.content?.directives) {
          return { directives: jsonContent.content.directives, source: "json.content.directives" };
        }
        if (jsonContent.contenu?.directives_anticipees) {
          return { directives: jsonContent.contenu.directives_anticipees, source: "json.contenu.directives_anticipees" };
        }
        
        // Return the whole JSON if nothing specific found
        return { directives: jsonContent, source: "json" };
      }
    } catch (jsonError) {
      console.log("Not valid JSON:", jsonError);
    }
    
    // Check if it's an XML-like string
    if (stringContent.includes('<directives>')) {
      const directivesMatch = stringContent.match(/<directives>(.*?)<\/directives>/s);
      if (directivesMatch && directivesMatch[1]) {
        return { directives: directivesMatch[1], source: "xml.directives" };
      }
    }
    
    // Look for directive-like content in plain text
    if (stringContent.toLowerCase().includes('directives anticipées')) {
      // Extract the surrounding paragraph or section
      const lines = stringContent.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes('directives anticipées')) {
          // Extract a few lines as the directive
          const startLine = Math.max(0, i - 2);
          const endLine = Math.min(lines.length - 1, i + 5);
          const directiveContent = lines.slice(startLine, endLine + 1).join('\n');
          return { directives: directiveContent, source: "text" };
        }
      }
    }
    
    // As a last resort, return the full content if not too long
    if (stringContent.length < 1000) {
      return { directives: stringContent, source: "texte_complet" };
    }
    
    // Return first 500 characters as a sample
    return { directives: stringContent.substring(0, 500) + "...", source: "texte_partiel" };
    
  } catch (error) {
    console.error("Error extracting directives from string:", error);
    return null;
  }
};
