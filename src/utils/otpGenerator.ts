
/**
 * Génère un code OTP numérique aléatoire
 * @param length - Longueur du code (par défaut 6)
 * @returns Code OTP sous forme de chaîne
 */
export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return otp;
};

/**
 * Génère un code OTP alphanumérique (plus sécurisé)
 * @param length - Longueur du code (par défaut 8)
 * @returns Code OTP alphanumérique
 */
export const generateAlphanumericOTP = (length: number = 8): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
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
  const numericRegex = new RegExp(`^\\d{${expectedLength}}$`);
  return numericRegex.test(otp);
};

/**
 * Valide le format d'un code OTP alphanumérique
 * @param otp - Code à valider
 * @param expectedLength - Longueur attendue (par défaut 8)
 * @returns true si le format est valide
 */
export const validateAlphanumericOTPFormat = (otp: string, expectedLength: number = 8): boolean => {
  const alphanumericRegex = new RegExp(`^[0-9A-Z]{${expectedLength}}$`);
  return alphanumericRegex.test(otp);
};
