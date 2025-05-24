
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
    .replace(/\s+/g, " "); // Normalise les espaces
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
  
  // Comparaison avec variations communes (noms composés, etc.)
  const inputParts = normalizedInput.split(" ").filter(part => part.length > 0);
  const profileParts = normalizedProfile.split(" ").filter(part => part.length > 0);
  
  console.log("Name parts comparison:", { inputParts, profileParts });
  
  // Si l'un contient tous les mots de l'autre
  const inputContainsProfile = profileParts.every(profilePart => 
    inputParts.some(inputPart => inputPart.includes(profilePart))
  );
  
  const profileContainsInput = inputParts.every(inputPart => 
    profileParts.some(profilePart => profilePart.includes(inputPart))
  );
  
  const result = inputContainsProfile || profileContainsInput;
  
  console.log("Flexible match result:", { inputContainsProfile, profileContainsInput, finalResult: result });
  return result;
};
