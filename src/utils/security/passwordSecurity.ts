
import { z } from "zod";

/**
 * Mots de passe couramment utilisés à bannir
 */
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'azerty',
  'motdepasse', 'admin123', 'root', 'toor', 'pass', '12345678'
];

/**
 * Interface pour le résultat de validation de mot de passe
 */
export interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  strength: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
}

/**
 * Validation renforcée des mots de passe selon les standards de sécurité
 */
export const validatePasswordSecurity = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 0;
  
  // Vérifications obligatoires
  if (!password) {
    errors.push("Le mot de passe est requis");
    return { isValid: false, score: 0, errors, warnings, strength: 'very-weak' };
  }
  
  // Longueur minimum (critique)
  if (password.length < 12) {
    errors.push("Le mot de passe doit contenir au moins 12 caractères");
  } else {
    score += 20;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;
  }
  
  // Complexité obligatoire
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigits = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  
  if (!hasLowercase) errors.push("Au moins une lettre minuscule requise");
  else score += 10;
  
  if (!hasUppercase) errors.push("Au moins une lettre majuscule requise");
  else score += 10;
  
  if (!hasDigits) errors.push("Au moins un chiffre requis");
  else score += 10;
  
  if (!hasSpecialChars) errors.push("Au moins un caractère spécial requis (!@#$%^&*...)");
  else score += 15;
  
  // Vérification contre les mots de passe courants
  const lowerPassword = password.toLowerCase();
  if (COMMON_PASSWORDS.some(common => lowerPassword.includes(common.toLowerCase()))) {
    errors.push("Ce mot de passe est trop courant et facilement devinable");
  } else {
    score += 15;
  }
  
  // Détection de modèles simples
  if (/(.)\1{2,}/.test(password)) {
    warnings.push("Évitez de répéter le même caractère plusieurs fois");
    score -= 5;
  }
  
  if (/123|abc|qwe|azer/i.test(password)) {
    warnings.push("Évitez les séquences simples de caractères");
    score -= 5;
  }
  
  // Variété de caractères
  const uniqueChars = new Set(password).size;
  if (uniqueChars < password.length * 0.6) {
    warnings.push("Utilisez une plus grande variété de caractères");
  } else {
    score += 10;
  }
  
  // Déterminer la force
  let strength: PasswordValidationResult['strength'];
  if (score < 30) strength = 'very-weak';
  else if (score < 50) strength = 'weak';
  else if (score < 70) strength = 'medium';
  else if (score < 90) strength = 'strong';
  else strength = 'very-strong';
  
  return {
    isValid: errors.length === 0,
    score: Math.min(100, Math.max(0, score)),
    errors,
    warnings,
    strength
  };
};

/**
 * Schéma Zod pour validation de mot de passe sécurisé
 */
export const securePasswordSchema = z.string()
  .min(12, "Le mot de passe doit contenir au moins 12 caractères")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/, "Le mot de passe doit contenir au moins un caractère spécial")
  .refine((password) => {
    const lowerPassword = password.toLowerCase();
    return !COMMON_PASSWORDS.some(common => lowerPassword.includes(common.toLowerCase()));
  }, "Ce mot de passe est trop courant et facilement devinable");

/**
 * Générateur de mot de passe sécurisé
 */
export const generateSecurePassword = (length: number = 16): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let password = '';
  
  // Garantir au moins un caractère de chaque type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Compléter avec des caractères aléatoires
  const allChars = lowercase + uppercase + digits + special;
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mélanger le mot de passe
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
