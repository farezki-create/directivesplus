
/**
 * Extract directives from string content (JSON or XML)
 */

/**
 * Attempts to extract directives from string content that might be JSON or XML
 * @param decryptedContent String content to parse
 * @returns Object containing directives and source if found
 */
export const extractDirectivesFromString = (decryptedContent: string) => {
  if (typeof decryptedContent !== 'string') return null;
  
  // Skip if content doesn't look medical
  if (!decryptedContent.includes('directive') && 
      !decryptedContent.includes('medical') && 
      !decryptedContent.includes('patient')) {
    return null;
  }

  // First try JSON parsing
  try {
    const parsedContent = JSON.parse(decryptedContent);
    if (parsedContent && typeof parsedContent === 'object') {
      // Use the same paths as in coreExtractor
      const paths = [
        ['directives_anticipees'], ['directives'],
        ['content', 'directives_anticipees'], ['content', 'directives'],
        ['contenu', 'directives_anticipees'], ['contenu', 'directives'],
        ['meta', 'directives'], ['dicom', 'directives'],
        ['dossier', 'directives_anticipees'], ['dossier', 'directives'],
        ['document', 'directives'], ['data', 'directives'],
        ['xmlData', 'directives'], ['xml', 'directives']
      ];
      
      for (const path of paths) {
        let obj = parsedContent;
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
          return { directives: obj, source: `string.parsed.${path.join('.')}` };
        }
      }
    }
  } catch (error) {
    // If JSON parsing fails, try XML extraction
    if (decryptedContent.includes('<directive') || decryptedContent.includes('<directives')) {
      // Extraction simplifiée de balises XML (comme format radiologie)
      const extractXmlContent = (xml: string, tag: string) => {
        const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'gs');
        const matches = [...xml.matchAll(regex)];
        if (matches.length > 0) {
          return matches.map(m => m[1]).join('\n');
        }
        return null;
      };
      
      // Essayer d'extraire des balises communes dans les formats médicaux
      const xmlTags = ['directive', 'directives', 'directivesAnticipees', 'wishes', 'instructions'];
      for (const tag of xmlTags) {
        const content = extractXmlContent(decryptedContent, tag);
        if (content) {
          return { directives: { [tag]: content }, source: `xml.${tag}` };
        }
      }
    }
  }
  
  return null;
};
