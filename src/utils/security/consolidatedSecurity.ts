
import { toast } from "@/hooks/use-toast";

/**
 * Configuration unifiée de sécurité
 */
export const SECURITY_CONFIG = {
  // Authentification
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_MINUTES: 15,
  
  // Vérification email
  MAX_EMAIL_VERIFICATION_ATTEMPTS: 3,
  EMAIL_VERIFICATION_LOCKOUT_MINUTES: 10,
  
  // Réinitialisation mot de passe
  MAX_PASSWORD_RESET_ATTEMPTS: 3,
  PASSWORD_RESET_LOCKOUT_MINUTES: 30,
  
  // Fenêtre de temps pour rate limiting
  RATE_LIMIT_WINDOW_MINUTES: 15
};

/**
 * Interface pour les tentatives d'authentification
 */
interface SecurityAttempt {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  isBlocked: boolean;
  blockExpiration: number | null;
}

/**
 * Store unifié pour toutes les tentatives de sécurité
 */
const securityStore = new Map<string, SecurityAttempt>();

/**
 * Types d'opérations sécurisées
 */
export type SecurityOperationType = 'login' | 'email_verification' | 'password_reset';

/**
 * Résultat d'une vérification de sécurité
 */
export interface SecurityCheckResult {
  allowed: boolean;
  remainingAttempts: number;
  lockoutMinutes?: number;
}

/**
 * Fonction unifiée pour vérifier les tentatives de sécurité
 */
export const checkSecurityAttempt = (
  identifier: string,
  operationType: SecurityOperationType = 'login'
): SecurityCheckResult => {
  const now = Date.now();
  const config = getSecurityConfig(operationType);
  
  const key = `${operationType}_${identifier}`;
  let attempt = securityStore.get(key);
  
  if (!attempt) {
    attempt = {
      attempts: 0,
      firstAttempt: now,
      lastAttempt: now,
      isBlocked: false,
      blockExpiration: null
    };
    securityStore.set(key, attempt);
  }
  
  // Vérifier si le blocage est expiré
  if (attempt.isBlocked && attempt.blockExpiration && now > attempt.blockExpiration) {
    attempt.isBlocked = false;
    attempt.attempts = 0;
    attempt.firstAttempt = now;
    attempt.blockExpiration = null;
  }
  
  // Si bloqué, refuser
  if (attempt.isBlocked && attempt.blockExpiration) {
    const remainingMs = attempt.blockExpiration - now;
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    
    logSecurityEvent('blocked_attempt', {
      operationType,
      identifier,
      attempts: attempt.attempts,
      remainingMinutes
    });
    
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutMinutes: remainingMinutes
    };
  }
  
  // Réinitialiser si la fenêtre de temps est dépassée
  const windowMs = config.windowMinutes * 60 * 1000;
  if (now - attempt.firstAttempt > windowMs) {
    attempt.attempts = 0;
    attempt.firstAttempt = now;
  }
  
  // Incrémenter les tentatives
  attempt.attempts += 1;
  attempt.lastAttempt = now;
  
  // Vérifier si on dépasse le seuil
  if (attempt.attempts > config.maxAttempts) {
    attempt.isBlocked = true;
    attempt.blockExpiration = now + (config.lockoutMinutes * 60 * 1000);
    
    logSecurityEvent('lockout_triggered', {
      operationType,
      identifier,
      attempts: attempt.attempts,
      lockoutMinutes: config.lockoutMinutes
    });
    
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutMinutes: config.lockoutMinutes
    };
  }
  
  return {
    allowed: true,
    remainingAttempts: config.maxAttempts - attempt.attempts
  };
};

/**
 * Réinitialise le compteur après un succès
 */
export const resetSecurityAttempts = (
  identifier: string,
  operationType: SecurityOperationType = 'login'
): void => {
  const key = `${operationType}_${identifier}`;
  securityStore.delete(key);
  
  logSecurityEvent('successful_operation', {
    operationType,
    identifier
  });
};

/**
 * Configuration par type d'opération
 */
const getSecurityConfig = (operationType: SecurityOperationType) => {
  switch (operationType) {
    case 'email_verification':
      return {
        maxAttempts: SECURITY_CONFIG.MAX_EMAIL_VERIFICATION_ATTEMPTS,
        lockoutMinutes: SECURITY_CONFIG.EMAIL_VERIFICATION_LOCKOUT_MINUTES,
        windowMinutes: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MINUTES
      };
    case 'password_reset':
      return {
        maxAttempts: SECURITY_CONFIG.MAX_PASSWORD_RESET_ATTEMPTS,
        lockoutMinutes: SECURITY_CONFIG.PASSWORD_RESET_LOCKOUT_MINUTES,
        windowMinutes: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MINUTES
      };
    default: // login
      return {
        maxAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS,
        lockoutMinutes: SECURITY_CONFIG.LOGIN_LOCKOUT_MINUTES,
        windowMinutes: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MINUTES
      };
  }
};

/**
 * Log des événements de sécurité
 */
const logSecurityEvent = (event: string, details: any): void => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.warn('SECURITY EVENT:', logEntry);
};

/**
 * Nettoyage périodique des anciennes entrées
 */
setInterval(() => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  for (const [key, attempt] of securityStore.entries()) {
    if (now - attempt.lastAttempt > oneDayMs) {
      securityStore.delete(key);
    }
  }
}, 60 * 60 * 1000); // Nettoyage toutes les heures
