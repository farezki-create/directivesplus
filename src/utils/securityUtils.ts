
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

/**
 * Vérifie la force d'un mot de passe selon des critères stricts
 * Conforme aux recommandations ANSSI et CNIL
 */
export const evaluatePasswordStrength = (password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
} => {
  if (!password) return { score: 0, feedback: ["Mot de passe requis"], isStrong: false };
  
  const feedback: string[] = [];
  let score = 0;
  
  // Longueur du mot de passe (jusqu'à 40 points)
  const lengthScore = Math.min(40, password.length * 3);
  score += lengthScore;
  
  if (password.length < 12) {
    feedback.push("Le mot de passe devrait contenir au moins 12 caractères");
  }
  
  // Complexité (jusqu'à 60 points)
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigits = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
  
  if (hasUppercase) score += 10;
  else feedback.push("Ajouter au moins une lettre majuscule");
  
  if (hasLowercase) score += 10;
  else feedback.push("Ajouter au moins une lettre minuscule");
  
  if (hasDigits) score += 10;
  else feedback.push("Ajouter au moins un chiffre");
  
  if (hasSpecialChars) score += 15;
  else feedback.push("Ajouter au moins un caractère spécial");
  
  // Variété de caractères
  const uniqueChars = new Set(password).size;
  score += Math.min(15, uniqueChars);
  
  if (uniqueChars < 8) {
    feedback.push("Utiliser une plus grande variété de caractères");
  }
  
  // Modèles courants
  if (/^[A-Za-z]+\d+$/.test(password)) {
    score -= 10;
    feedback.push("Éviter le modèle simple texte+chiffres");
  }
  
  // Séquences courantes
  const sequences = ["123", "abc", "qwerty", "azerty"];
  for (const seq of sequences) {
    if (password.toLowerCase().includes(seq)) {
      score -= 10;
      feedback.push("Éviter les séquences courantes de caractères");
      break;
    }
  }
  
  // Limite le score final entre 0 et 100
  const finalScore = Math.max(0, Math.min(100, score));
  
  // Un mot de passe est considéré comme fort s'il a un score > 80 et répond aux critères minimums
  const isStrong = finalScore > 80 && hasUppercase && hasLowercase && hasDigits && hasSpecialChars && password.length >= 12;
  
  // Si le mot de passe est fort et qu'il y a des remarques d'amélioration, on les supprime
  const finalFeedback = isStrong ? [] : feedback;
  
  return { 
    score: finalScore, 
    feedback: finalFeedback,
    isStrong 
  };
};

// Limite de tentatives pour la détection de force brute
interface BruteForceProtection {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  isBlocked: boolean;
  blockExpiration: number | null;
}

const bruteForceStore: Record<string, BruteForceProtection> = {};

/**
 * Détection de tentatives de force brute
 * @param identifier Identifiant pour l'action (ex: adresse IP, combinaison user+IP, etc.)
 * @param maxAttempts Nombre maximum de tentatives avant blocage
 * @param timeWindowMinutes Fenêtre de temps en minutes pour les tentatives
 * @param blockDurationMinutes Durée du blocage en minutes
 * @returns Si l'action est autorisée ou bloquée
 */
export const checkBruteForceAttempt = (
  identifier: string, 
  maxAttempts: number = 5,
  timeWindowMinutes: number = 15,
  blockDurationMinutes: number = 30
): { allowed: boolean; remainingAttempts: number; blockExpiresIn?: number } => {
  const now = Date.now();
  const timeWindowMs = timeWindowMinutes * 60 * 1000;
  const blockDurationMs = blockDurationMinutes * 60 * 1000;
  
  // Initialiser les données de protection si nécessaire
  if (!bruteForceStore[identifier]) {
    bruteForceStore[identifier] = {
      attempts: 0,
      firstAttempt: now,
      lastAttempt: now,
      isBlocked: false,
      blockExpiration: null
    };
  }
  
  const protection = bruteForceStore[identifier];
  
  // Vérifier si le blocage est expiré
  if (protection.isBlocked && protection.blockExpiration && now > protection.blockExpiration) {
    // Réinitialiser après expiration du blocage
    protection.isBlocked = false;
    protection.attempts = 0;
    protection.firstAttempt = now;
    protection.blockExpiration = null;
  }
  
  // Si bloqué, renvoyer le statut
  if (protection.isBlocked && protection.blockExpiration) {
    const remainingBlockMs = protection.blockExpiration - now;
    return {
      allowed: false,
      remainingAttempts: 0,
      blockExpiresIn: Math.ceil(remainingBlockMs / 1000) // en secondes
    };
  }
  
  // Réinitialiser le compteur si la fenêtre de temps est dépassée
  if (now - protection.firstAttempt > timeWindowMs) {
    protection.attempts = 0;
    protection.firstAttempt = now;
  }
  
  // Incrémenter le compteur de tentatives
  protection.attempts += 1;
  protection.lastAttempt = now;
  
  // Vérifier si le seuil est dépassé
  if (protection.attempts > maxAttempts) {
    protection.isBlocked = true;
    protection.blockExpiration = now + blockDurationMs;
    
    // Journaliser la détection d'attaque potentielle
    console.warn(`Potentielle attaque par force brute détectée pour ${identifier}. Blocage pour ${blockDurationMinutes} minutes.`);
    
    return {
      allowed: false,
      remainingAttempts: 0,
      blockExpiresIn: blockDurationMs / 1000 // en secondes
    };
  }
  
  return {
    allowed: true,
    remainingAttempts: maxAttempts - protection.attempts
  };
};

/**
 * Réinitialise le compteur de tentatives après une authentification réussie
 */
export const resetBruteForceCounter = (identifier: string): void => {
  if (bruteForceStore[identifier]) {
    delete bruteForceStore[identifier];
  }
};

// Nettoyage périodique des anciennes entrées
setInterval(() => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  Object.keys(bruteForceStore).forEach(key => {
    const entry = bruteForceStore[key];
    // Supprimer les entrées de plus de 24h
    if (now - entry.lastAttempt > oneDayMs) {
      delete bruteForceStore[key];
    }
  });
}, 60 * 60 * 1000); // Nettoyage toutes les heures
