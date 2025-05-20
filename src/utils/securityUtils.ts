
/**
 * Génère un code d'accès aléatoire et sécurisé
 * @param length Longueur du code (défaut: 12)
 * @returns Code d'accès généré
 */
export const generateSecureCode = (length: number = 12): string => {
  // Caractères pour générer un code sécurisé (sans ambiguïtés comme 0/O, 1/l, etc.)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  // Utiliser Crypto API pour générer des nombres aléatoires cryptographiquement sûrs
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    // Utiliser modulo pour obtenir un index dans la plage des caractères
    result += chars[randomValues[i] % chars.length];
  }
  
  return result;
};

/**
 * Vérifie la force d'un code d'accès
 * @param code Code à vérifier
 * @returns Score de force (0-100)
 */
export const evaluateCodeStrength = (code: string): number => {
  if (!code) return 0;
  
  let score = 0;
  
  // Longueur (jusqu'à 50 points)
  score += Math.min(50, code.length * 5);
  
  // Complexité (jusqu'à 50 points)
  if (/[A-Z]/.test(code)) score += 10; // Majuscules
  if (/[a-z]/.test(code)) score += 10; // Minuscules
  if (/[0-9]/.test(code)) score += 10; // Chiffres
  if (/[^A-Za-z0-9]/.test(code)) score += 20; // Caractères spéciaux
  
  return Math.min(100, score);
};
