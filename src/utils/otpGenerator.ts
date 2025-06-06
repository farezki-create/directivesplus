
/**
 * Génère un code OTP numérique aléatoire sécurisé
 * @param length - Longueur du code (par défaut 6)
 * @returns Code OTP sous forme de chaîne
 */
export const generateSecureOTP = (length: number = 6): string => {
  // Utiliser crypto.getRandomValues pour une génération sécurisée
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += (array[i] % 10).toString();
  }
  
  return otp;
};

/**
 * Valide le format d'un code OTP
 * @param otp - Code à valider
 * @param expectedLength - Longueur attendue (par défaut 6)
 * @returns true si le format est valide
 */
export const validateOTPFormat = (otp: string, expectedLength: number = 6): boolean => {
  if (!otp || typeof otp !== 'string') return false;
  
  const numericRegex = new RegExp(`^\\d{${expectedLength}}$`);
  return numericRegex.test(otp);
};

/**
 * Vérifie la force d'un code OTP (éviter les codes trop prévisibles)
 * @param otp - Code à vérifier
 * @returns true si le code est acceptable
 */
export const isOTPSecure = (otp: string): boolean => {
  if (!validateOTPFormat(otp)) return false;
  
  // Éviter les codes avec tous les mêmes chiffres
  if (new Set(otp).size === 1) return false;
  
  // Éviter les séquences simples (123456, 654321)
  const isSequential = otp.split('').every((digit, index) => {
    if (index === 0) return true;
    const prev = parseInt(otp[index - 1]);
    const curr = parseInt(digit);
    return Math.abs(curr - prev) === 1;
  });
  
  if (isSequential) return false;
  
  return true;
};

/**
 * Génère un OTP sécurisé en évitant les patterns prévisibles
 * @param length - Longueur du code
 * @param maxAttempts - Nombre max de tentatives pour générer un code sécurisé
 * @returns Code OTP sécurisé
 */
export const generateValidatedOTP = (length: number = 6, maxAttempts: number = 10): string => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const otp = generateSecureOTP(length);
    if (isOTPSecure(otp)) {
      return otp;
    }
  }
  
  // Fallback si on n'arrive pas à générer un code sécurisé
  return generateSecureOTP(length);
};

/**
 * Vérifie si un code OTP est expiré
 * @param expiresAt - Date d'expiration au format ISO
 * @returns true si expiré
 */
export const isOTPExpired = (expiresAt: string): boolean => {
  try {
    const expiry = new Date(expiresAt);
    const now = new Date();
    return now > expiry;
  } catch {
    return true; // En cas d'erreur de format, considérer comme expiré
  }
};

/**
 * Calcule le temps restant avant expiration en minutes
 * @param expiresAt - Date d'expiration au format ISO
 * @returns Minutes restantes (0 si expiré)
 */
export const getOTPTimeRemaining = (expiresAt: string): number => {
  try {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));
    return Math.max(0, diffMinutes);
  } catch {
    return 0;
  }
};
