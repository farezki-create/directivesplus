
/**
 * Utilitaires pour la normalisation des chaînes de caractères
 */

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/\s+/g, " "); // Normalise les espaces
};

export const compareNames = (input: string, profile: string): boolean => {
  const normalizedInput = normalizeString(input);
  const normalizedProfile = normalizeString(profile);
  
  console.log("Comparing names:", { input, normalizedInput, profile, normalizedProfile });
  
  // Comparaison exacte d'abord
  if (normalizedInput === normalizedProfile) {
    console.log("Exact match found");
    return true;
  }
  
  // Comparaison avec variations communes
  const inputParts = normalizedInput.split(" ");
  const profileParts = normalizedProfile.split(" ");
  
  // Vérifier si tous les mots de l'input sont dans le profil
  const result = inputParts.every(inputPart => 
    profileParts.some(profilePart => 
      profilePart.includes(inputPart) || inputPart.includes(profilePart)
    )
  );
  
  console.log("Flexible match result:", result);
  return result;
};
