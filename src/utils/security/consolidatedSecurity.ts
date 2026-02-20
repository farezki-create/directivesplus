
/**
 * Système de sécurité consolidé et amélioré
 * Point central pour toutes les fonctionnalités de sécurité
 */

export type SecurityOperationType = 
  | 'login' 
  | 'email_verification' 
  | 'password_reset'
  | 'document_access'
  | 'directive_access'
  | 'admin_action';

export interface SecurityAttempt {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

export interface SecurityCheckResult {
  allowed: boolean;
  remainingAttempts: number;
  lockoutMinutes: number;
  nextAttemptAllowed?: Date;
}

export interface SecurityEvent {
  type: SecurityOperationType;
  identifier: string;
  success: boolean;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

class ConsolidatedSecurityManager {
  private attempts = new Map<string, SecurityAttempt>();
  private securityEvents: SecurityEvent[] = [];
  
  // Configuration des limites par type d'opération
  private readonly limits = {
    login: { maxAttempts: 5, lockoutMinutes: 15 },
    email_verification: { maxAttempts: 3, lockoutMinutes: 30 },
    password_reset: { maxAttempts: 3, lockoutMinutes: 60 },
    document_access: { maxAttempts: 10, lockoutMinutes: 5 },
    directive_access: { maxAttempts: 10, lockoutMinutes: 5 },
    admin_action: { maxAttempts: 3, lockoutMinutes: 30 }
  };

  /**
   * Vérifie si une opération de sécurité est autorisée
   */
  checkSecurityAttempt(identifier: string, type: SecurityOperationType): SecurityCheckResult {
    const key = `${type}_${identifier}`;
    const now = Date.now();
    const attempt = this.attempts.get(key);
    const config = this.limits[type];

    if (!attempt) {
      // Première tentative
      this.attempts.set(key, {
        attempts: 1,
        lastAttempt: now
      });

      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - 1,
        lockoutMinutes: config.lockoutMinutes
      };
    }

    // Vérifier si encore verrouillé
    if (attempt.lockedUntil && now < attempt.lockedUntil) {
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutMinutes: Math.ceil((attempt.lockedUntil - now) / (1000 * 60)),
        nextAttemptAllowed: new Date(attempt.lockedUntil)
      };
    }

    // Réinitialiser si verrouillage expiré
    if (attempt.lockedUntil && now >= attempt.lockedUntil) {
      this.attempts.set(key, {
        attempts: 1,
        lastAttempt: now
      });

      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - 1,
        lockoutMinutes: config.lockoutMinutes
      };
    }

    // Incrémenter les tentatives
    const newAttempts = attempt.attempts + 1;

    if (newAttempts >= config.maxAttempts) {
      // Verrouiller
      const lockoutUntil = now + (config.lockoutMinutes * 60 * 1000);
      this.attempts.set(key, {
        attempts: newAttempts,
        lastAttempt: now,
        lockedUntil: lockoutUntil
      });

      // Enregistrer l'événement de sécurité
      this.logSecurityEvent({
        type,
        identifier,
        success: false,
        timestamp: new Date(),
        metadata: { reason: 'rate_limit_exceeded', attempts: newAttempts }
      });

      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutMinutes: config.lockoutMinutes,
        nextAttemptAllowed: new Date(lockoutUntil)
      };
    }

    // Mise à jour des tentatives
    this.attempts.set(key, {
      attempts: newAttempts,
      lastAttempt: now
    });

    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - newAttempts,
      lockoutMinutes: config.lockoutMinutes
    };
  }

  /**
   * Réinitialise les tentatives après un succès
   */
  resetSecurityAttempts(identifier: string, type: SecurityOperationType): void {
    const key = `${type}_${identifier}`;
    this.attempts.delete(key);

    // Enregistrer l'événement de succès
    this.logSecurityEvent({
      type,
      identifier,
      success: true,
      timestamp: new Date()
    });
  }

  /**
   * Enregistre un événement de sécurité
   */
  private logSecurityEvent(event: SecurityEvent): void {
    // Ajouter l'adresse IP et user agent si disponibles
    if (typeof window !== 'undefined') {
      event.userAgent = navigator.userAgent;
    }

    this.securityEvents.push(event);

    // Garder seulement les 1000 derniers événements
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }

  }

  /**
   * Obtient les événements de sécurité récents
   */
  getRecentSecurityEvents(limit: number = 50): SecurityEvent[] {
    return this.securityEvents.slice(-limit).reverse();
  }

  /**
   * Obtient les statistiques de sécurité
   */
  getSecurityStats(): {
    totalEvents: number;
    failedAttempts: number;
    successfulAttempts: number;
    lockedAccounts: number;
    topFailedOperations: Array<{ type: SecurityOperationType; count: number }>;
  } {
    const totalEvents = this.securityEvents.length;
    const failedAttempts = this.securityEvents.filter(e => !e.success).length;
    const successfulAttempts = this.securityEvents.filter(e => e.success).length;
    
    const now = Date.now();
    const lockedAccounts = Array.from(this.attempts.values())
      .filter(attempt => attempt.lockedUntil && now < attempt.lockedUntil).length;

    // Calculer les types d'opérations qui échouent le plus
    const failuresByType = new Map<SecurityOperationType, number>();
    this.securityEvents
      .filter(e => !e.success)
      .forEach(e => {
        const count = failuresByType.get(e.type) || 0;
        failuresByType.set(e.type, count + 1);
      });

    const topFailedOperations = Array.from(failuresByType.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalEvents,
      failedAttempts,
      successfulAttempts,
      lockedAccounts,
      topFailedOperations
    };
  }

  /**
   * Détecte les anomalies de sécurité
   */
  detectSecurityAnomalies(): Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }> {
    const anomalies = [];
    const stats = this.getSecurityStats();
    const recentEvents = this.getRecentSecurityEvents(100);

    // Trop de tentatives échouées récentes
    const recentFailures = recentEvents.filter(e => !e.success).length;
    if (recentFailures > 20) {
      anomalies.push({
        type: 'high_failure_rate',
        severity: 'high' as const,
        description: `${recentFailures} tentatives échouées dans les derniers événements`,
        recommendation: 'Vérifier s\'il y a une attaque en cours'
      });
    }

    // Beaucoup de comptes verrouillés
    if (stats.lockedAccounts > 10) {
      anomalies.push({
        type: 'multiple_lockouts',
        severity: 'medium' as const,
        description: `${stats.lockedAccounts} comptes actuellement verrouillés`,
        recommendation: 'Analyser les patterns d\'attaque et ajuster les limites'
      });
    }

    // Pas d\'événements récents (monitoring down?)
    if (recentEvents.length === 0) {
      anomalies.push({
        type: 'no_recent_activity',
        severity: 'low' as const,
        description: 'Aucun événement de sécurité récent détecté',
        recommendation: 'Vérifier que le monitoring fonctionne correctement'
      });
    }

    return anomalies;
  }

  /**
   * Nettoie les anciennes tentatives
   */
  cleanupOldAttempts(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures

    for (const [key, attempt] of this.attempts.entries()) {
      // Supprimer les tentatives anciennes non verrouillées
      if (!attempt.lockedUntil && (now - attempt.lastAttempt) > maxAge) {
        this.attempts.delete(key);
      }
      // Supprimer les verrouillages expirés
      else if (attempt.lockedUntil && now >= attempt.lockedUntil) {
        this.attempts.delete(key);
      }
    }
  }

  /**
   * Force le déverrouillage d'un identifiant (admin seulement)
   */
  forceUnlock(identifier: string, type: SecurityOperationType): void {
    const key = `${type}_${identifier}`;
    this.attempts.delete(key);

    this.logSecurityEvent({
      type: 'admin_action' as SecurityOperationType,
      identifier: `force_unlock_${identifier}`,
      success: true,
      timestamp: new Date(),
      metadata: { action: 'force_unlock', target: key }
    });
  }

  /**
   * Génère un rapport de sécurité complet
   */
  generateSecurityReport(): {
    summary: ReturnType<typeof this.getSecurityStats>;
    anomalies: ReturnType<typeof this.detectSecurityAnomalies>;
    recentEvents: SecurityEvent[];
    recommendations: string[];
  } {
    const summary = this.getSecurityStats();
    const anomalies = this.detectSecurityAnomalies();
    const recentEvents = this.getRecentSecurityEvents(20);

    const recommendations = [];
    
    if (summary.failedAttempts > summary.successfulAttempts) {
      recommendations.push('Taux d\'échec élevé détecté - vérifier les attaques potentielles');
    }
    
    if (anomalies.some(a => a.severity === 'critical' || a.severity === 'high')) {
      recommendations.push('Anomalies critiques détectées - intervention immédiate recommandée');
    }
    
    if (summary.lockedAccounts > 5) {
      recommendations.push('Plusieurs comptes verrouillés - considérer l\'ajustement des seuils');
    }

    return {
      summary,
      anomalies,
      recentEvents,
      recommendations
    };
  }
}

// Instance globale
export const consolidatedSecurity = new ConsolidatedSecurityManager();

// Nettoyage automatique toutes les heures
if (typeof window !== 'undefined') {
  setInterval(() => {
    consolidatedSecurity.cleanupOldAttempts();
  }, 60 * 60 * 1000);
}

// Fonctions de compatibilité
export const checkSecurityAttempt = consolidatedSecurity.checkSecurityAttempt.bind(consolidatedSecurity);
export const resetSecurityAttempts = consolidatedSecurity.resetSecurityAttempts.bind(consolidatedSecurity);
