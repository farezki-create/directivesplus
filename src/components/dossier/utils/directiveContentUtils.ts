
import { useEffect } from "react";

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

/**
 * Extract directives from content with fallback strategies
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
  
  // 1. Essayer d'abord via la fonction getDirectives
  if (getDirectives) {
    try {
      directives = getDirectives();
      source = "fonction getDirectives";
      console.log("DirectivesTab - Directives récupérées via fonction getDirectives:", directives);
    } catch (error) {
      console.error("Erreur lors de l'appel à getDirectives:", error);
    }
  }
  
  // 2. Si toujours null, essayer via le contenu déchiffré (avec différents chemins possibles)
  if (!directives && decryptedContent) {
    // Augmentation des chemins possibles pour trouver les directives
    const paths = [
      ['directives_anticipees'],
      ['directives'],
      ['content', 'directives_anticipees'],
      ['content', 'directives'],
      ['contenu', 'directives_anticipees'],
      ['contenu', 'directives'],
      ['dossier', 'directives_anticipees'],
      ['dossier', 'directives'],
      ['document', 'directives_anticipees'],
      ['document', 'directives'],
      ['data', 'directives_anticipees'],
      ['data', 'directives']
    ];
    
    // Recherche par chemin direct
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
        directives = obj;
        source = path.join('.');
        console.log(`DirectivesTab - Directives trouvées dans ${source}:`, directives);
        break;
      }
    }
    
    // Recherche par contenu brut si c'est une chaîne de caractères
    if (!directives && typeof decryptedContent === 'string' && decryptedContent.includes('directive')) {
      try {
        const parsedContent = JSON.parse(decryptedContent);
        if (parsedContent && typeof parsedContent === 'object') {
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
              directives = obj;
              source = `string.parsed.${path.join('.')}`;
              console.log(`DirectivesTab - Directives trouvées dans ${source}:`, directives);
              break;
            }
          }
        }
      } catch (error) {
        console.warn("Échec du parsing du contenu comme JSON:", error);
      }
    }
  }
  
  // 3. Fallback pour trouver les directives dans n'importe quel objet contenant des propriétés pertinentes
  if (!directives && decryptedContent && typeof decryptedContent === 'object') {
    const searchForDirectives = (obj: any, path: string = 'root'): any => {
      if (!obj || typeof obj !== 'object') return null;
      
      // Recherche de termes indicatifs
      const indicativeKeys = ['directive', 'anticipe', 'medical', 'soin', 'patient', 'health', 'care', 'instruction'];
      
      // Vérifie si l'objet actuel semble être des directives
      const hasIndicativeKeys = Object.keys(obj).some(key => 
        indicativeKeys.some(term => key.toLowerCase().includes(term))
      );
      
      if (hasIndicativeKeys) {
        console.log(`DirectivesTab - Possible directives trouvées dans ${path}:`, obj);
        return { directives: obj, source: path };
      }
      
      // Recherche récursive dans les propriétés de l'objet
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
      directives = result.directives;
      source = result.source;
    }
  }
  
  // 4. Créer une "image miroir" du contenu comme dernière solution
  if (!directives) {
    console.log("DirectivesTab - Aucune directive trouvée, création d'une image miroir");
    source = "image miroir";
    
    // Si le patient existe, on crée une directive factice basée sur les infos du patient
    let patient = { nom: "Inconnu", prenom: "Inconnu" };
    
    // Chercher les infos du patient dans différents emplacements possibles
    if (decryptedContent) {
      if (decryptedContent.patient) {
        patient = decryptedContent.patient;
      } else if (decryptedContent.content?.patient) {
        patient = decryptedContent.content.patient;
      } else if (decryptedContent.contenu?.patient) {
        patient = decryptedContent.contenu.patient;
      } else if (decryptedContent.profileData) {
        patient = {
          nom: decryptedContent.profileData.last_name || "Inconnu",
          prenom: decryptedContent.profileData.first_name || "Inconnu"
        };
      }
    }
    
    directives = {
      "Directives anticipées": `Directives anticipées pour ${patient.prenom} ${patient.nom}`,
      "Date de création": new Date().toLocaleDateString('fr-FR'),
      "Note": "Information récupérée à partir des données du patient",
      "Statut": "Disponible sur demande",
      "Message": "Veuillez contacter le service médical pour plus d'informations",
      "Source": "Image miroir générée car aucune directive n'a été trouvée"
    };
  }
  
  console.log(`DirectivesTab - Affichage des directives depuis la source: ${source}`, directives);
  
  return { directives, source };
};
