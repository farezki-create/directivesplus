
/**
 * Rate limiter côté client simple et efficace
 */
interface RateLimitEntry {
  attempts: number;
  windowStart: number;
}

class ClientRateLimiter {
  private store = new Map<string, RateLimitEntry>();

  /**
   * Vérifie si une action est autorisée selon les limites
   */
  checkLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    let entry = this.store.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      // Nouvelle fenêtre ou première tentative
      entry = { attempts: 1, windowStart: now };
      this.store.set(key, entry);
      return true;
    }

    if (entry.attempts >= maxAttempts) {
      return false; // Limite atteinte
    }

    entry.attempts++;
    return true;
  }

  /**
   * Obtient le temps restant avant la fin de la fenêtre
   */
  getRemainingTime(key: string): number {
    const entry = this.store.get(key);
    if (!entry) return 0;

    const elapsed = Date.now() - entry.windowStart;
    return Math.max(0, (15 * 60 * 1000) - elapsed); // 15 minutes par défaut
  }

  /**
   * Nettoie les entrées expirées
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.windowStart > maxAge) {
        this.store.delete(key);
      }
    }
  }
}

export const clientRateLimiter = new ClientRateLimiter();

// Nettoyage automatique toutes les heures
setInterval(() => {
  clientRateLimiter.cleanup();
}, 60 * 60 * 1000);
