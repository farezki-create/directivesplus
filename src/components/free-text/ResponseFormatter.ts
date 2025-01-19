const RESPONSE_MAPPING: Record<string, string> = {
  'je_ne_sais_pas': 'je ne sais pas',
  'oui_durée_modérée': 'oui pour une durée modérée',
  'oui_duree_moderée': 'oui pour une durée modérée',
  'oui_duree_moderee': 'oui pour une durée modérée',
  'oui_médical': 'oui seulement si l\'équipe médicale le juge utile',
  'oui_medical': 'oui seulement si l\'équipe médicale le juge utile',
  'non_souffrance': 'la non souffrance est à privilégier',
};

export const formatResponseText = (response: string): string => {
  console.log("[ResponseFormatter] Formatting response:", response);
  // First, check if it's in the mapping
  const mappedResponse = RESPONSE_MAPPING[response];
  if (mappedResponse) {
    console.log("[ResponseFormatter] Found in mapping, formatted to:", mappedResponse);
    return mappedResponse;
  }
  
  // If not in mapping, remove any quotation marks, parentheses and square brackets from the response
  // and replace commas with "et"
  const formattedResponse = response
    .replace(/['"\(\)\[\]]/g, '')
    .replace(/,/g, ' et ');
  
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