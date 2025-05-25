
import { auditService } from "./auditService";
import { clientRateLimiter } from "./rateLimiter";

/**
 * Moniteur de sécurité pour détecter les activités suspectes
 */

interface SecurityMetrics {
  failedLogins: number;
  suspiciousAccess: number;
  rateLimitViolations: number;
  lastActivity: Date;
}

class SecurityMonitor {
  private metrics: Map<string, SecurityMetrics> = new Map();
  private readonly thresholds = {
    maxFailedLogins: 5,
    maxSuspiciousAccess: 10,
    maxRateLimitViolations: 3,
    monitoringWindow: 60 * 60 * 1000 // 1 heure
  };

  /**
   * Surveille une tentative de connexion
   */
  async monitorLogin(userId: string, success: boolean, ip: string): Promise<void> {
    const metrics = this.getOrCreateMetrics(userId);
    
    if (!success) {
      metrics.failedLogins++;
      
      if (metrics.failedLogins >= this.thresholds.maxFailedLogins) {
        await this.triggerSecurityAlert('MULTIPLE_FAILED_LOGINS', userId, {
          failedAttempts: metrics.failedLogins,
          ip,
          timeWindow: this.thresholds.monitoringWindow
        });
      }
    } else {
      // Reset sur succès
      metrics.failedLogins = 0;
    }
    
    metrics.lastActivity = new Date();
  }

  /**
   * Surveille l'accès aux documents
   */
  async monitorDocumentAccess(userId: string, documentId: string, suspicious: boolean = false): Promise<void> {
    const metrics = this.getOrCreateMetrics(userId);
    
    if (suspicious) {
      metrics.suspiciousAccess++;
      
      if (metrics.suspiciousAccess >= this.thresholds.maxSuspiciousAccess) {
        await this.triggerSecurityAlert('SUSPICIOUS_DOCUMENT_ACCESS', userId, {
          documentId,
          suspiciousAttempts: metrics.suspiciousAccess
        });
      }
    }
    
    metrics.lastActivity = new Date();
  }

  /**
   * Surveille les violations de rate limiting
   */
  async monitorRateLimit(identifier: string, limitType: string): Promise<void> {
    const metrics = this.getOrCreateMetrics(identifier);
    metrics.rateLimitViolations++;
    
    if (metrics.rateLimitViolations >= this.thresholds.maxRateLimitViolations) {
      await this.triggerSecurityAlert('RATE_LIMIT_ABUSE', identifier, {
        limitType,
        violations: metrics.rateLimitViolations
      });
    }
    
    metrics.lastActivity = new Date();
  }

  /**
   * Vérifie si un accès est suspect
   */
  isSuspiciousAccess(userId: string, context: any): boolean {
    // Logique de détection d'activité suspecte
    const patterns = [
      this.isRapidAccess(userId),
      this.isUnusualTimeAccess(),
      this.isUnusualVolumeAccess(userId, context)
    ];
    
    return patterns.some(pattern => pattern);
  }

  /**
   * Vérifie l'intégrité des données d'accès
   */
  validateAccessIntegrity(accessData: any): boolean {
    const requiredFields = ['userId', 'timestamp', 'resourceId'];
    
    // Vérification des champs obligatoires
    if (!requiredFields.every(field => accessData[field])) {
      return false;
    }
    
    // Vérification de la cohérence temporelle
    const timestamp = new Date(accessData.timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    // Rejeter les accès trop anciens ou futurs
    if (diff < 0 || diff > 5 * 60 * 1000) { // 5 minutes max
      return false;
    }
    
    return true;
  }

  private getOrCreateMetrics(identifier: string): SecurityMetrics {
    if (!this.metrics.has(identifier)) {
      this.metrics.set(identifier, {
        failedLogins: 0,
        suspiciousAccess: 0,
        rateLimitViolations: 0,
        lastActivity: new Date()
      });
    }
    return this.metrics.get(identifier)!;
  }

  private async triggerSecurityAlert(alertType: string, identifier: string, details: any): Promise<void> {
    console.warn(`🚨 ALERTE SÉCURITÉ: ${alertType} pour ${identifier}`, details);
    
    await auditService.logSecurityViolation(alertType, {
      identifier,
      ...details,
      alertLevel: 'high',
      timestamp: new Date().toISOString()
    });
    
    // En production, envoyer une notification aux administrateurs
  }

  private isRapidAccess(userId: string): boolean {
    const metrics = this.metrics.get(userId);
    if (!metrics) return false;
    
    const timeSinceLastActivity = Date.now() - metrics.lastActivity.getTime();
    return timeSinceLastActivity < 1000; // Moins d'1 seconde
  }

  private isUnusualTimeAccess(): boolean {
    const hour = new Date().getHours();
    return hour < 6 || hour > 22; // En dehors des heures normales
  }

  private isUnusualVolumeAccess(userId: string, context: any): boolean {
    // Vérifier le volume d'accès dans une fenêtre temporelle
    return context?.accessCount > 50; // Plus de 50 accès par heure
  }

  /**
   * Nettoie les métriques anciennes
   */
  cleanupOldMetrics(): void {
    const cutoff = Date.now() - this.thresholds.monitoringWindow;
    
    for (const [identifier, metrics] of this.metrics.entries()) {
      if (metrics.lastActivity.getTime() < cutoff) {
        this.metrics.delete(identifier);
      }
    }
  }
}

export const securityMonitor = new SecurityMonitor();

// Nettoyage automatique toutes les heures
setInterval(() => {
  securityMonitor.cleanupOldMetrics();
}, 60 * 60 * 1000);
