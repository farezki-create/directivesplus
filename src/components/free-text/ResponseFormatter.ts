
const RESPONSE_MAPPING: Record<string, string> = {
  'je_ne_sais_pas': 'je ne sais pas',
  'oui_durée_modérée': 'oui pour une durée modérée',
  'oui_duree_moderée': 'oui pour une durée modérée',
  'oui_duree_moderee': 'oui pour une durée modérée',
  'oui_médical': 'oui seulement si l\'équipe médicale le juge utile',
  'oui_medical': 'oui seulement si l\'équipe médicale le juge utile',
  'non_souffrance': 'la non souffrance est à privilégier',
  'incertain': 'je ne suis pas sûr(e)',
  'oui': 'oui',
  'non': 'non',
};

export const formatResponseText = (response: string): string => {
  console.log("[ResponseFormatter] Formatting response:", response);
  
  if (!response) {
    console.warn("[ResponseFormatter] Empty response received");
    return '';
  }
  
  // Remove any array notation if present
  const cleanResponse = response.replace(/[\[\]"']/g, '');
  
  // Split the response by "et" or comma to handle multiple values
  const parts = cleanResponse.split(/[,\s]+et\s+|\s*,\s*/);
  
  // Format each part individually
  const formattedParts = parts.map(part => {
    const trimmedPart = part.trim();
    
    // First, check if it's in the mapping
    const mappedResponse = RESPONSE_MAPPING[trimmedPart];
    if (mappedResponse) {
      console.log("[ResponseFormatter] Found in mapping, formatted to:", mappedResponse);
      return mappedResponse;
    }
    
    // If not in mapping, remove any quotation marks, parentheses and square brackets
    const formattedPart = trimmedPart.replace(/['"\(\)\[\]]/g, '');
    console.log("[ResponseFormatter] Formatted part to:", formattedPart);
    return formattedPart;
  });
  
  // Filter out empty responses
  const nonEmptyResponses = formattedParts.filter(part => part.trim().length > 0);
  
  // Join the parts back together with " et "
  const finalResponse = nonEmptyResponses.join(' et ');
  console.log("[ResponseFormatter] Final formatted response:", finalResponse);
  return finalResponse;
};

export const formatResponses = (responseArray: any[]) => {
  if (!responseArray || responseArray.length === 0) {
    return [];
  }

  return responseArray.map(response => {
    // Vérifier si la réponse est valide
    if (!response) return null;
    
    // Extraire la question en prioritisant différentes sources possibles
    const question = response.question_text || 
                    response.questions?.Question || 
                    response.life_support_questions?.question ||
                    response.advanced_illness_questions?.question ||
                    response.preferences_questions?.question ||
                    response.question ||
                    'Question non disponible';
                    
    // Formater la réponse
    const formattedResponse = formatResponseText(response.response);
    
    return {
      question,
      response: formattedResponse
    };
  }).filter(Boolean); // Filtrer les réponses nulles
};
