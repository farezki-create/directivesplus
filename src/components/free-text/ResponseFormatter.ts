export const formatResponseText = (response: string): string => {
  switch (response) {
    case 'je_ne_sais_pas':
      return 'je ne sais pas';
    case 'oui_durée_modérée':
    case 'oui_duree_moderee':
    case 'oui_duree_moderée':
      return 'oui pour une durée modérée';
    case 'oui_médical':
      return 'oui seulement si l\'équipe médicale le juge utile';
    default:
      return response;
  }
};

export const formatResponses = (responseArray: any[]) => {
  if (!responseArray || responseArray.length === 0) {
    return [];
  }

  return responseArray.map(response => ({
    question: response.question_text || 
              response.questions?.Question || 
              response.life_support_questions?.question ||
              response.advanced_illness_questions?.question ||
              response.preferences_questions?.question,
    response: formatResponseText(response.response)
  }));
};