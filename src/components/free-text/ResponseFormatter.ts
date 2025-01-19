const RESPONSE_MAPPING: Record<string, string> = {
  'je_ne_sais_pas': 'je ne sais pas',
  'oui_durée_modérée': 'oui pour une durée modérée',
  'oui_duree_moderée': 'oui pour une durée modérée',
  'oui_duree_moderee': 'oui pour une durée modérée',
  'oui_médical': 'oui seulement si l\'équipe médicale le juge utile',
  'oui_medical': 'oui seulement si l\'équipe médicale le juge utile',
  'non': 'la non souffrance est à privilégier',
};

export const formatResponseText = (response: string): string => {
  console.log("[ResponseFormatter] Formatting response:", response);
  const formattedResponse = RESPONSE_MAPPING[response] || response;
  console.log("[ResponseFormatter] Formatted to:", formattedResponse);
  return formattedResponse;
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