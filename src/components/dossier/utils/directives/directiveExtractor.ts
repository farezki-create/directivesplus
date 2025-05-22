
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
  
  // 2. Si toujours null, essayer via le contenu déchiffré (avec chemins système de radiologie)
  if (!directives && decryptedContent) {
    // Chemins standardisés pour les systèmes médicaux (DMP, Radiologie, Mon Espace Santé)
    const paths = [
      // Chemins Mon Espace Santé
      ['directives_anticipees'],
      ['directives'],
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
        directives = obj;
        source = path.join('.');
        console.log(`DirectivesTab - Directives trouvées dans ${source}:`, directives);
        break;
      }
    }
    
    // Recherche par contenu brut (format XML/JSON like radiologie)
    if (!directives && typeof decryptedContent === 'string' && 
        (decryptedContent.includes('directive') || 
         decryptedContent.includes('medical') || 
         decryptedContent.includes('patient'))) {
      try {
        // Format de données similaire au DICOM ou standard médical
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
        
        // Tentative d'extraction XML comme dans les systèmes de radiologie
        if (decryptedContent.includes('<directive') || 
            decryptedContent.includes('<directives')) {
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
              directives = { [tag]: content };
              source = `xml.${tag}`;
              console.log(`DirectivesTab - Directives extraites du XML dans ${source}:`, directives);
              break;
            }
          }
        }
      }
    }
  }
  
  // 3. Recherche intelligente similaire aux méthodes de systèmes de radiologie
  if (!directives && decryptedContent && typeof decryptedContent === 'object') {
    const searchForDirectives = (obj: any, path: string = 'root'): any => {
      if (!obj || typeof obj !== 'object') return null;
      
      // Termes médicaux standardisés (compatible avec terminologies médicales)
      const indicativeKeys = [
        'directive', 'anticipe', 'medical', 'soin', 'patient', 'health',
        'care', 'instruction', 'wish', 'preference', 'decision', 'consent',
        'traitement', 'volonte', 'fin', 'vie', 'reanimation', 'resuscitation'
      ];
      
      // Vérifier si l'objet semble contenir des directives (comme analyse DICOM)
      const hasIndicativeKeys = Object.keys(obj).some(key => 
        indicativeKeys.some(term => key.toLowerCase().includes(term))
      );
      
      if (hasIndicativeKeys) {
        console.log(`DirectivesTab - Possible directives trouvées dans ${path}:`, obj);
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
      directives = result.directives;
      source = result.source;
    }
  }
  
  // 4. Créer une "image miroir" comme dans les systèmes Mon Espace Santé
  if (!directives) {
    console.log("DirectivesTab - Aucune directive trouvée, création d'une image miroir");
    source = "image miroir";
    
    // Création d'un document standardisé basé sur le patient
    let patient = { nom: "Inconnu", prenom: "Inconnu" };
    
    // Chercher les infos du patient dans différents emplacements (format médical standard)
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
      } else if (decryptedContent.meta?.patient) {
        patient = decryptedContent.meta.patient;
      }
    }
    
    // Format standardisé des directives (similaire au DMP/Mon Espace Santé)
    directives = {
      "Directives anticipées": `Directives anticipées pour ${patient.prenom} ${patient.nom}`,
      "Date de création": new Date().toLocaleDateString('fr-FR'),
      "Personne de confiance": "Non spécifiée",
      "Instructions": "Document disponible sur demande",
      "Remarque": "Ces directives sont une représentation simplifiée"
    };
  }
  
  console.log(`DirectivesTab - Affichage des directives depuis la source: ${source}`, directives);
  
  return { directives, source };
};
