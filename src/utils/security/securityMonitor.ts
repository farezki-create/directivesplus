
/**
 * Service de monitoring de sécurité en temps réel
 */

export interface SecurityMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'stable' | 'increasing' | 'decreasing';
}

export interface SecurityAlert {
  id: string;
  type: 'intrusion' | 'brute_force' | 'data_breach' | 'system_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  recommendations: string[];
}

class SecurityMonitor {
  private metrics: Map<string, SecurityMetric> = new Map();
  private alerts: SecurityAlert[] = [];
  private isMonitoring = false;

  /**
   * Démarre le monitoring de sécurité
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.initializeMetrics();
    
    // Surveillance continue
    setInterval(() => {
      this.updateMetrics();
      this.checkThresholds();
    }, 30000); // Toutes les 30 secondes

    
  }

  /**
   * Arrête le monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    
  }

  /**
   * Initialise les métriques de base
   */
  private initializeMetrics(): void {
    this.metrics.set('failed_logins', {
      name: 'Tentatives de connexion échouées',
      value: 0,
      threshold: 10,
      status: 'normal',
      trend: 'stable'
    });

    this.metrics.set('suspicious_access', {
      name: 'Accès suspects',
      value: 0,
      threshold: 5,
      status: 'normal',
      trend: 'stable'
    });

    this.metrics.set('data_access_rate', {
      name: 'Taux d\'accès aux données',
      value: 0,
      threshold: 100,
      status: 'normal',
      trend: 'stable'
    });

    this.metrics.set('system_errors', {
      name: 'Erreurs système',
      value: 0,
      threshold: 20,
      status: 'normal',
      trend: 'stable'
    });
  }

  /**
   * Met à jour les métriques
   */
  private updateMetrics(): void {
    // Simuler des métriques (en production, ces données viendraient de vrais systèmes)
    this.metrics.forEach((metric, key) => {
      const previousValue = metric.value;
      
      // Simulation de valeurs
      switch (key) {
        case 'failed_logins':
          metric.value = Math.floor(Math.random() * 8);
          break;
        case 'suspicious_access':
          metric.value = Math.floor(Math.random() * 3);
          break;
        case 'data_access_rate':
          metric.value = Math.floor(Math.random() * 50) + 20;
          break;
        case 'system_errors':
          metric.value = Math.floor(Math.random() * 10);
          break;
      }

      // Calculer la tendance
      if (metric.value > previousValue) {
        metric.trend = 'increasing';
      } else if (metric.value < previousValue) {
        metric.trend = 'decreasing';
      } else {
        metric.trend = 'stable';
      }

      // Mettre à jour le statut
      if (metric.value >= metric.threshold) {
        metric.status = 'critical';
      } else if (metric.value >= metric.threshold * 0.8) {
        metric.status = 'warning';
      } else {
        metric.status = 'normal';
      }
    });
  }

  /**
   * Vérifie les seuils et génère des alertes
   */
  private checkThresholds(): void {
    this.metrics.forEach((metric, key) => {
      if (metric.status === 'critical' || metric.status === 'warning') {
        this.generateAlert(key, metric);
      }
    });
  }

  /**
   * Génère une alerte de sécurité
   */
  private generateAlert(metricKey: string, metric: SecurityMetric): void {
    // Éviter les doublons d'alertes
    const existingAlert = this.alerts.find(
      alert => alert.type === metricKey && !alert.resolved
    );
    
    if (existingAlert) return;

    const alert: SecurityAlert = {
      id: crypto.randomUUID(),
      type: metricKey as any,
      severity: metric.status === 'critical' ? 'critical' : 'medium',
      message: `${metric.name}: ${metric.value} (seuil: ${metric.threshold})`,
      timestamp: new Date(),
      resolved: false,
      recommendations: this.getRecommendations(metricKey, metric)
    };

    this.alerts.unshift(alert);
    
    // Garder seulement les 50 dernières alertes
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(0, 50);
    }

    console.warn('🚨 Alerte de sécurité:', alert);
  }

  /**
   * Génère des recommandations basées sur la métrique
   */
  private getRecommendations(metricKey: string, metric: SecurityMetric): string[] {
    const recommendations: { [key: string]: string[] } = {
      failed_logins: [
        'Vérifier les logs d\'authentification',
        'Renforcer la protection contre le brute force',
        'Analyser les adresses IP suspectes'
      ],
      suspicious_access: [
        'Auditer les codes d\'accès générés',
        'Vérifier les accès non autorisés',
        'Renforcer le monitoring des accès'
      ],
      data_access_rate: [
        'Analyser les patterns d\'accès aux données',
        'Vérifier la légitimité des accès massifs',
        'Optimiser les performances si nécessaire'
      ],
      system_errors: [
        'Vérifier les logs d\'erreur système',
        'Analyser la stabilité de l\'infrastructure',
        'Effectuer une maintenance préventive'
      ]
    };

    return recommendations[metricKey] || ['Analyser la situation et prendre les mesures appropriées'];
  }

  /**
   * Résout une alerte
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      
    }
  }

  /**
   * Obtient toutes les métriques
   */
  getMetrics(): SecurityMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Obtient les alertes actives
   */
  getActiveAlerts(): SecurityAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Obtient toutes les alertes
   */
  getAllAlerts(): SecurityAlert[] {
    return this.alerts;
  }

  /**
   * Obtient le statut global de sécurité
   */
  getSecurityStatus(): {
    status: 'secure' | 'warning' | 'critical';
    score: number;
    activeThreats: number;
    summary: string;
  } {
    const metrics = this.getMetrics();
    const activeAlerts = this.getActiveAlerts();
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical').length;
    const warningAlerts = activeAlerts.filter(a => a.severity === 'medium' || a.severity === 'high').length;

    let status: 'secure' | 'warning' | 'critical' = 'secure';
    let score = 100;

    if (criticalAlerts > 0) {
      status = 'critical';
      score = Math.max(0, 100 - (criticalAlerts * 30) - (warningAlerts * 10));
    } else if (warningAlerts > 0) {
      status = 'warning';
      score = Math.max(50, 100 - (warningAlerts * 15));
    }

    const summary = status === 'secure' 
      ? 'Système sécurisé, aucune menace détectée'
      : status === 'warning'
        ? `${warningAlerts} avertissement(s) de sécurité détecté(s)`
        : `${criticalAlerts} menace(s) critique(s) détectée(s)`;

    return {
      status,
      score,
      activeThreats: activeAlerts.length,
      summary
    };
  }
}

export const securityMonitor = new SecurityMonitor();
