
// Stratégie de cache pour optimiser les performances
class CacheManager {
  private memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // Cache en mémoire avec TTL
  set(key: string, data: any, ttl = this.DEFAULT_TTL) {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string) {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Cache pour les réponses de questionnaire
  cacheQuestionnaireResponses(questionnaireType: string, responses: Record<string, string>) {
    this.set(`questionnaire_${questionnaireType}`, responses, 10 * 60 * 1000); // 10 min
  }

  getCachedQuestionnaireResponses(questionnaireType: string) {
    return this.get(`questionnaire_${questionnaireType}`);
  }

  // Cache pour les documents
  cacheDocument(documentId: string, documentData: any) {
    this.set(`document_${documentId}`, documentData, 30 * 60 * 1000); // 30 min
  }

  getCachedDocument(documentId: string) {
    return this.get(`document_${documentId}`);
  }

  // Nettoyage du cache
  clearExpired() {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Nettoyage complet
  clear() {
    this.memoryCache.clear();
  }
}

export const cacheManager = new CacheManager();

// Nettoyage automatique du cache toutes les 5 minutes
setInterval(() => {
  cacheManager.clearExpired();
}, 5 * 60 * 1000);

// Cache localStorage pour la persistance
export const persistentCache = {
  set(key: string, data: any, expirationHours = 24) {
    const item = {
      data,
      expiration: Date.now() + (expirationHours * 60 * 60 * 1000)
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },

  get(key: string) {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiration) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  },

  remove(key: string) {
    localStorage.removeItem(`cache_${key}`);
  }
};
