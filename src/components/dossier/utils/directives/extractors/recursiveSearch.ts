
/**
 * Récupère les directives dans des objets complexes par recherche récursive
 */

/**
 * Recherche récursivement les directives dans des objets imbriqués
 * @param decryptedContent Le contenu à analyser
 * @returns Objet contenant les directives et la source si trouvées
 */
export const searchDirectivesRecursively = (decryptedContent: any) => {
  if (!decryptedContent || typeof decryptedContent !== 'object') return null;
  
  console.log("searchDirectivesRecursively analysant un objet");
  
  // Détection pour les chaînes de caractères dédiées aux directives
  if (typeof decryptedContent === 'string' && 
      (decryptedContent.includes('directives anticipées') || 
       decryptedContent.includes('Directives anticipées') || 
       decryptedContent.includes('Personne de confiance'))) {
    console.log("Directives trouvées dans une chaîne de caractères");
    return { directives: decryptedContent, source: 'texte' };
  }
  
  // Recherche des directives en format PDF direct (data URI)
  if (typeof decryptedContent === 'string' && 
      decryptedContent.startsWith('data:application/pdf')) {
    console.log("Document PDF de directives trouvé");
    return { directives: decryptedContent, source: 'pdf' };
  }
  
  const searchForDirectives = (obj: any, path: string = 'root'): any => {
    if (!obj || typeof obj !== 'object') return null;
    
    // Termes médicaux standardisés et identifiants de directives couramment utilisés
    const indicativeKeys = [
      'directive', 'anticipe', 'medical', 'soin', 'patient', 'health',
      'care', 'instruction', 'wish', 'preference', 'decision', 'consent',
      'traitement', 'volonte', 'fin', 'vie', 'reanimation', 'resuscitation',
      'personne', 'confiance', 'personne_confiance', 'directives_anticipees',
      'contenu', 'date_creation', 'souhaits'
    ];
    
    // Identifier les clés précises des directives anticipées
    const directiveSpecificKeys = [
      'directives_anticipees', 'directives', 'directive_anticipee',  
      'directive'
    ];
    
    // Vérifier si l'objet est exactement un objet de directives
    const hasDirectiveKeys = directiveSpecificKeys.some(key => 
      obj[key] !== undefined || key in obj
    );
    
    if (hasDirectiveKeys) {
      const directiveKey = directiveSpecificKeys.find(key => key in obj);
      if (directiveKey && obj[directiveKey]) {
        console.log(`Directives trouvées à la clé spécifique ${directiveKey} au chemin: ${path}`);
        return { directives: obj[directiveKey], source: path };
      }
    }
    
    // Vérifier si l'objet semble contenir des directives (mots-clés indicatifs)
    const hasIndicativeKeys = Object.keys(obj).some(key => 
      indicativeKeys.some(term => key.toLowerCase().includes(term))
    );
    
    if (hasIndicativeKeys) {
      console.log(`Objet de type directives trouvé au chemin: ${path}`, Object.keys(obj));
      return { directives: obj, source: path };
    }
    
    // Cas spécial: si c'est un tableau d'objets qui pourrait contenir des directives
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const result = searchForDirectives(obj[i], `${path}[${i}]`);
        if (result) return result;
      }
    }
    
    // Recherche récursive standard
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        const found = searchForDirectives(obj[key], `${path}.${key}`);
        if (found) return found;
      } else if (typeof obj[key] === 'string' && 
                (obj[key].includes('directives anticipées') || 
                 obj[key].includes('Directives anticipées'))) {
        // Cas où la valeur d'une propriété est une chaîne contenant des directives
        console.log(`Directive textuelle trouvée dans la propriété ${key} au chemin: ${path}`);
        return { directives: obj[key], source: `${path}.${key}` };
      }
    }
    
    return null;
  };
  
  // Traitement spécial pour les objets qui ont une structure spécifique de contenu de dossier médical
  if (decryptedContent.contenu_dossier) {
    const result = searchForDirectives(decryptedContent.contenu_dossier, 'contenu_dossier');
    if (result) return result;
  }
  
  // Si le contenu a une propriété directives_anticipees, retourner directement
  if (decryptedContent.directives_anticipees) {
    console.log("directives_anticipees trouvées directement dans l'objet racine");
    return { directives: decryptedContent.directives_anticipees, source: 'directives_anticipees' };
  }
  
  // Si le contenu a une propriété directives, retourner directement
  if (decryptedContent.directives) {
    console.log("directives trouvées directement dans l'objet racine");
    return { directives: decryptedContent.directives, source: 'directives' };
  }
  
  // Recherche récursive standard pour tous les autres cas
  const result = searchForDirectives(decryptedContent);
  if (result) {
    console.log("Recherche récursive: directives trouvées à:", result.source);
  }
  return result;
};
