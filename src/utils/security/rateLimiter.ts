
/**
 * Configuration du rate limiting pour la conformité HDS
 */

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

export const rateLimitConfigs = {
  // Rate limit général
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes par fenêtre
    message: {
      error: 'Trop de requêtes, veuillez réessayer plus tard.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  } as RateLimitConfig,

  // Rate limit pour l'authentification
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives de connexion
    message: {
      error: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  } as RateLimitConfig,

  // Rate limit pour les codes d'accès
  accessCode: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // 3 tentatives de code d'accès
    message: {
      error: 'Trop de tentatives de code d\'accès, veuillez réessayer dans 10 minutes.',
      code: 'ACCESS_CODE_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  } as RateLimitConfig,

  // Rate limit pour les uploads
  upload: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 uploads par minute
    message: {
      error: 'Trop d\'uploads, veuillez réessayer dans une minute.',
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  } as RateLimitConfig
};

/**
 * Créer un rate limiter côté client (simulation)
 */
export class ClientRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  checkLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;
    
    const remaining = attempt.resetTime - Date.now();
    return Math.max(0, remaining);
  }
}

export const clientRateLimiter = new ClientRateLimiter();
