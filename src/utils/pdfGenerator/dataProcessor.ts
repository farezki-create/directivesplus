
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
  // PDF generation data logging (disabled in production)
};
