
/**
 * Utilitaires pour la normalisation des chaînes de caractères
 */

export const normalizeString = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/\s+/g, " ") // Normalise les espaces
    .replace(/[^\w\s]/g, ""); // Supprime la ponctuation
};

export const compareNames = (input: string, profile: string): boolean => {
  if (!input || !profile) {
    console.log("Empty input or profile name:", { input, profile });
    return false;
  }
  
  const normalizedInput = normalizeString(input);
  const normalizedProfile = normalizeString(profile);
  
  console.log("Comparing names:", { 
    original_input: input, 
    normalized_input: normalizedInput, 
    original_profile: profile, 
    normalized_profile: normalizedProfile 
  });
  
  // Comparaison exacte d'abord
  if (normalizedInput === normalizedProfile) {
    console.log("Exact match found");
    return true;
  }
  
  // Comparaison flexible pour les noms composés
  const inputParts = normalizedInput.split(" ").filter(part => part.length > 1);
  const profileParts = normalizedProfile.split(" ").filter(part => part.length > 1);
  
  console.log("Name parts comparison:", { inputParts, profileParts });
  
  // Vérifier si tous les mots principaux correspondent (dans n'importe quel ordre)
  const inputContainsAllProfile = profileParts.every(profilePart => 
    inputParts.some(inputPart => 
      inputPart.includes(profilePart) || profilePart.includes(inputPart) || 
      levenshteinDistance(inputPart, profilePart) <= 1
    )
  );
  
  const profileContainsAllInput = inputParts.every(inputPart => 
    profileParts.some(profilePart => 
      profilePart.includes(inputPart) || inputPart.includes(profilePart) ||
      levenshteinDistance(inputPart, profilePart) <= 1
    )
  );
  
  const result = inputContainsAllProfile || profileContainsAllInput;
  
  console.log("Flexible match result:", { 
    inputContainsAllProfile, 
    profileContainsAllInput, 
    finalResult: result 
  });
  
  return result;
};

// Fonction pour calculer la distance de Levenshtein (pour gérer les petites fautes de frappe)
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
