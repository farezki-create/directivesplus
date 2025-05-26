
// Function to translate response strings from English to French
export const translateResponse = (response: string): string => {
  if (!response) return 'Pas de réponse';
  
  const lowerResponse = response.toLowerCase().trim();
  
  switch (lowerResponse) {
    case 'yes':
      return 'Oui';
    case 'no':
      return 'Non';
    case 'unsure':
      return 'Incertain';
    default:
      return response;
  }
};

// Function to log PDF generation data for debugging
export const logPdfGenerationData = (data: any): void => {
  console.log("=== DÉBUT GÉNÉRATION PDF ===");
  console.log("Données reçues pour le PDF:", {
    hasProfileData: !!data.profileData,
    profileData: data.profileData,
    hasResponses: !!data.responses,
    responsesCount: Object.keys(data.responses || {}).length,
    responses: data.responses,
    hasExamplePhrases: !!data.examplePhrases,
    examplePhrasesCount: data.examplePhrases?.length || 0,
    hasCustomPhrases: !!data.customPhrases,
    customPhrasesCount: data.customPhrases?.length || 0,
    hasTrustedPersons: !!data.trustedPersons,
    trustedPersonsCount: data.trustedPersons?.length || 0,
    trustedPersons: data.trustedPersons,
    hasFreeText: !!data.freeText,
    freeTextLength: data.freeText?.length || 0,
    hasSignature: !!data.signature,
    userId: data.userId
  });
};
