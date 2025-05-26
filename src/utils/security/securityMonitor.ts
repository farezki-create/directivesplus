
/**
 * Système de monitoring de sécurité en temps réel
 */

export interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  source: string;
  timestamp: Date;
  resolved: boolean;
}

export interface SecurityMetrics {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  criticalAlerts: number;
  alertsBySource: Record<string, number>;
  lastAlertTime?: Date;
}

class SecurityMonitor {
  private alerts: SecurityAlert[] = [];
  private listeners: Array<(alerts: SecurityAlert[]) => void> = [];

  /**
   * Ajoute une nouvelle alerte de sécurité
   */
  addAlert(severity: SecurityAlert['severity'], message: string, source: string): void {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      severity,
      message,
      source,
      timestamp: new Date(),
      resolved: false
    };

    this.alerts.push(alert);
    this.notifyListeners();

    // Log critique pour les alertes high/critical
    if (severity === 'high' || severity === 'critical') {
      console.error(`[SECURITY ALERT ${severity.toUpperCase()}] ${message} (Source: ${source})`);
    }
  }

  /**
   * Obtient toutes les alertes actives (non résolues)
   */
  getActiveAlerts(): SecurityAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Résout une alerte
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.notifyListeners();
      console.log(`[SECURITY] Alert ${alertId} resolved`);
    }
  }

  /**
   * Obtient toutes les alertes (résolues et non résolues)
   */
  getAllAlerts(): SecurityAlert[] {
    return [...this.alerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Obtient les métriques de sécurité
   */
  getSecurityMetrics(): SecurityMetrics {
    const totalAlerts = this.alerts.length;
    const activeAlerts = this.alerts.filter(a => !a.resolved).length;
    const resolvedAlerts = this.alerts.filter(a => a.resolved).length;
    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical' && !a.resolved).length;

    // Calculer les alertes par source
    const alertsBySource: Record<string, number> = {};
    this.alerts.forEach(alert => {
      alertsBySource[alert.source] = (alertsBySource[alert.source] || 0) + 1;
    });

    // Dernière alerte
    const lastAlertTime = this.alerts.length > 0 
      ? this.alerts[this.alerts.length - 1].timestamp 
      : undefined;

    return {
      totalAlerts,
      activeAlerts,
      resolvedAlerts,
      criticalAlerts,
      alertsBySource,
      lastAlertTime
    };
  }

  /**
   * Ajoute un listener pour les changements d'alertes
   */
  addListener(listener: (alerts: SecurityAlert[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifie tous les listeners
   */
  private notifyListeners(): void {
    const activeAlerts = this.getActiveAlerts();
    this.listeners.forEach(listener => listener(activeAlerts));
  }

  /**
   * Nettoie les anciennes alertes résolues
   */
  cleanupOldAlerts(): void {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours
    const now = Date.now();
    
    this.alerts = this.alerts.filter(alert => {
      if (alert.resolved && (now - alert.timestamp.getTime()) > maxAge) {
        return false;
      }
      return true;
    });
  }

  /**
   * Simule quelques alertes de test pour la démonstration
   */
  addTestAlerts(): void {
    this.addAlert('medium', 'Tentatives de connexion échouées détectées', 'auth-system');
    this.addAlert('low', 'Accès inhabituel depuis une nouvelle IP', 'access-monitor');
    this.addAlert('high', 'Audit de sécurité lancé automatiquement', 'audit-system');
  }

  /**
   * Lance un audit automatique
   */
  triggerSecurityAudit(): void {
    this.addAlert('medium', 'Audit de sécurité programmé démarré', 'audit-scheduler');
    console.log('🔍 [SECURITY] Audit automatique démarré');
  }
}

// Instance globale
export const securityMonitor = new SecurityMonitor();

// Nettoyage automatique toutes les heures
if (typeof window !== 'undefined') {
  setInterval(() => {
    securityMonitor.cleanupOldAlerts();
  }, 60 * 60 * 1000);
}
