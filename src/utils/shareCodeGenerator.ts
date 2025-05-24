
/**
 * Génère un code de partage unique pour les documents
 * @returns {string} Code de partage de 12 caractères
 */
export const generateShareCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Valide le format d'un code de partage
 * @param {string} code - Code à valider
 * @returns {boolean} True si le code est valide
 */
export const isValidShareCode = (code: string): boolean => {
  return /^[A-Z0-9]{12}$/.test(code);
};
