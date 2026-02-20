
// Utility functions for questionnaire
export const getSectionTable = (sectionId: string): string => {
  switch(sectionId) {
    case 'avis-general':
      return 'questionnaire_general_fr';
    case 'maintien-vie':
      return 'questionnaire_life_support_fr';
    case 'maladie-avancee':
      return 'questionnaire_advanced_illness_fr';
    case 'gouts-peurs':
      return 'questionnaire_preferences_fr';
    case 'personne-confiance':
      return 'trusted_persons';
    case 'exemples-phrases':
      return 'articles';
    default:
      console.warn(`No table mapping found for section: ${sectionId}`);
      return '';
  }
};

export const getResponseTable = (sectionId: string): string => {
  if (sectionId === 'gouts-peurs') {
    return 'questionnaire_preferences_responses';
  }
  return 'questionnaire_responses';
};

export const getSectionTitle = (pageId: string | undefined): string => {
  switch(pageId) {
    case 'avis-general': return "Avis Général";
    case 'maintien-vie': return "Maintien de la Vie";
    case 'maladie-avancee': return "Maladie Avancée";
    case 'gouts-peurs': return "Mes Goûts et Mes Peurs";
    case 'personne-confiance': return "Personne de Confiance";
    case 'exemples-phrases': return "Exemples de Phrases";
    default: return "";
  }
};
