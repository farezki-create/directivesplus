
import { toast } from "@/hooks/use-toast";

/**
 * Protection contre les attaques par force brute
 */
interface BruteForceAttempt {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  isBlocked: boolean;
  blockExpiration: number | null;
}

const bruteForceStore = new Map<string, BruteForceAttempt>();

/**
 * Configuration de sécurité
 */
const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
  RATE_LIMIT_WINDOW_MINUTES: 15,
  MAX_EMAIL_VERIFICATION_ATTEMPTS: 3,
  EMAIL_VERIFICATION_LOCKOUT_MINUTES: 10,
  MAX_PASSWORD_RESET_ATTEMPTS: 3,
  PASSWORD_RESET_LOCKOUT_MINUTES: 30
};

/**
 * Vérifie et enregistre une tentative d'authentification
 */
export const checkAuthAttempt = (
  identifier: string, 
  type: 'login' | 'email_verification' | 'password_reset' = 'login'
): { allowed: boolean; remainingAttempts: number; lockoutMinutes?: number } => {
  const now = Date.now();
  const config = getConfigForType(type);
  
  const key = `${type}_${identifier}`;
  let attempt = bruteForceStore.get(key);
  
  if (!attempt) {
    attempt = {
      attempts: 0,
      firstAttempt: now,
      lastAttempt: now,
      isBlocked: false,
      blockExpiration: null
    };
    bruteForceStore.set(key, attempt);
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
      type,
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
      type,
      identifier,
      attempts: attempt.attempts,
      lockoutMinutes: config.lockoutMinutes
    });
    
    toast({
      title: "Compte temporairement bloqué",
      description: `Trop de tentatives. Réessayez dans ${config.lockoutMinutes} minutes.`,
      variant: "destructive",
      duration: 8000
    });
    
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutMinutes: config.lockoutMinutes
    };
  }
  
  // Log des tentatives suspectes
  if (attempt.attempts >= Math.floor(config.maxAttempts / 2)) {
    logSecurityEvent('suspicious_attempts', {
      type,
      identifier,
      attempts: attempt.attempts,
      maxAttempts: config.maxAttempts
    });
  }
  
  return {
    allowed: true,
    remainingAttempts: config.maxAttempts - attempt.attempts
  };
};

/**
 * Réinitialise le compteur après un succès
 */
export const resetAuthAttempts = (identifier: string, type: 'login' | 'email_verification' | 'password_reset' = 'login'): void => {
  const key = `${type}_${identifier}`;
  bruteForceStore.delete(key);
  
  logSecurityEvent('successful_auth', {
    type,
    identifier
  });
};

/**
 * Génère un code de vérification sécurisé
 */
export const generateSecureVerificationCode = (length: number = 8): string => {
  // Utilise des caractères alphanumériques sans ambiguïtés
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789';
  
  // Utiliser Crypto API pour générer des nombres aléatoires cryptographiquement sûrs
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  
  return result;
};

/**
 * Validation de l'intégrité des tokens
 */
export const validateTokenIntegrity = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  // Vérifications de base
  if (token.length < 20) return false;
  if (!/^[A-Za-z0-9._-]+$/.test(token)) return false;
  
  return true;
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
  
  // En production, envoyer vers un service de logging sécurisé
  try {
    // Ici on pourrait envoyer vers Supabase ou un service externe
    // supabase.from('security_logs').insert(logEntry);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

/**
 * Configuration par type d'authentification
 */
const getConfigForType = (type: 'login' | 'email_verification' | 'password_reset') => {
  switch (type) {
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
        lockoutMinutes: SECURITY_CONFIG.LOCKOUT_DURATION_MINUTES,
        windowMinutes: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MINUTES
      };
  }
};

/**
 * Nettoyage périodique des anciennes entrées
 */
setInterval(() => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  for (const [key, attempt] of bruteForceStore.entries()) {
    if (now - attempt.lastAttempt > oneDayMs) {
      bruteForceStore.delete(key);
    }
  }
}, 60 * 60 * 1000); // Nettoyage toutes les heures

/**
 * Détection de géolocalisation suspecte (basique)
 */
export const detectSuspiciousLocation = async (): Promise<boolean> => {
  try {
    const lastLocation = localStorage.getItem('last_login_location');
    const response = await fetch('https://ipapi.co/json/');
    const currentLocation = await response.json();
    
    if (lastLocation) {
      const last = JSON.parse(lastLocation);
      const distance = calculateDistance(
        last.latitude, last.longitude,
        currentLocation.latitude, currentLocation.longitude
      );
      
      // Si la distance est > 1000km depuis la dernière connexion
      if (distance > 1000) {
        logSecurityEvent('suspicious_location', {
          lastLocation: last,
          currentLocation,
          distance
        });
        return true;
      }
    }
    
    localStorage.setItem('last_login_location', JSON.stringify(currentLocation));
    return false;
  } catch (error) {
    console.warn('Could not check location:', error);
    return false;
  }
};

/**
 * Calcul de distance entre deux points GPS
 */
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
