
// This file is now a re-export of functions from our new modules
// to maintain backward compatibility
import { getSectionTable, getResponseTable } from "./dataFetchers";

export { getSectionTable, getResponseTable };

export const getSectionTitle = (pageId: string | undefined): string => {
  console.log('Getting section title for:', pageId);
  switch(pageId) {
    case 'avis-general': 
      return "Avis Général";
    case 'maintien-vie': 
      return "Maintien de la Vie";
    case 'maladie-avancee': 
      return "Maladie Avancée";
    case 'gouts-peurs': 
      return "Mes Goûts et Mes Peurs";
    case 'personne-confiance': 
      return "Personne de Confiance";
    case 'exemples-phrases': 
      return "Exemples de Phrases";
    default:
      console.warn(`No title found for page: ${pageId}`);
      return "";
  }
};
