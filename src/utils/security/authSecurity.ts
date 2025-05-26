
import { checkSecurityAttempt, resetSecurityAttempts, SecurityOperationType } from "./consolidatedSecurity";

/**
 * @deprecated Utilisez checkSecurityAttempt depuis consolidatedSecurity
 */
export const checkAuthAttempt = (
  identifier: string,
  type: 'login' | 'email_verification' | 'password_reset' = 'login'
) => {
  console.warn('checkAuthAttempt est déprécié. Utilisez checkSecurityAttempt depuis consolidatedSecurity');
  return checkSecurityAttempt(identifier, type as SecurityOperationType);
};

/**
 * @deprecated Utilisez resetSecurityAttempts depuis consolidatedSecurity
 */
export const resetAuthAttempts = (
  identifier: string,
  type: 'login' | 'email_verification' | 'password_reset' = 'login'
) => {
  console.warn('resetAuthAttempts est déprécié. Utilisez resetSecurityAttempts depuis consolidatedSecurity');
  resetSecurityAttempts(identifier, type as SecurityOperationType);
};

/**
 * Génère un code de vérification sécurisé
 */
export const generateSecureVerificationCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789';
  
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
  
  if (token.length < 20) return false;
  if (!/^[A-Za-z0-9._-]+$/.test(token)) return false;
  
  return true;
};

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
      
      if (distance > 1000) {
        console.warn('Suspicious location detected:', {
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
