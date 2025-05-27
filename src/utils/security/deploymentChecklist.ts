
/**
 * Checklist de déploiement sécurisé pour l'environnement HDS
 */

export interface ChecklistItem {
  id: string;
  category: 'security' | 'compliance' | 'infrastructure' | 'monitoring';
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  evidence?: string;
  notes?: string;
}

export interface DeploymentReport {
  overall_status: 'ready' | 'needs_attention' | 'not_ready';
  completion_percentage: number;
  items: ChecklistItem[];
  blockers: ChecklistItem[];
  recommendations: string[];
  generated_at: Date;
}

class DeploymentChecklist {
  private items: ChecklistItem[] = [];

  constructor() {
    this.initializeChecklist();
  }

  /**
   * Initialise la checklist de déploiement
   */
  private initializeChecklist(): void {
    this.items = [
      // Sécurité
      {
        id: 'https-ssl',
        category: 'security',
        name: 'Certificat SSL/TLS',
        description: 'HTTPS activé avec certificat valide',
        status: 'pending',
        priority: 'critical'
      },
      {
        id: 'security-headers',
        category: 'security',
        name: 'Headers de sécurité',
        description: 'Configuration des headers CSP, HSTS, X-Frame-Options',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'auth-security',
        category: 'security',
        name: 'Sécurité authentification',
        description: 'Protection brute force et rate limiting activés',
        status: 'completed',
        priority: 'critical',
        evidence: 'Supabase Auth configuré'
      },
      {
        id: 'data-encryption',
        category: 'security',
        name: 'Chiffrement des données',
        description: 'Données chiffrées en transit et au repos',
        status: 'completed',
        priority: 'critical',
        evidence: 'Supabase + HTTPS'
      },
      {
        id: 'secrets-management',
        category: 'security',
        name: 'Gestion des secrets',
        description: 'Clés API et secrets stockés de manière sécurisée',
        status: 'completed',
        priority: 'critical',
        evidence: 'Supabase Secrets'
      },

      // Conformité
      {
        id: 'hds-hosting',
        category: 'compliance',
        name: 'Hébergement HDS',
        description: 'Hébergeur certifié HDS pour les données de santé',
        status: 'completed',
        priority: 'critical',
        evidence: 'Scalingo HDS certifié'
      },
      {
        id: 'gdpr-compliance',
        category: 'compliance',
        name: 'Conformité RGPD',
        description: 'Politique de confidentialité et droits des utilisateurs',
        status: 'completed',
        priority: 'critical',
        evidence: 'Page confidentialité implémentée'
      },
      {
        id: 'data-minimization',
        category: 'compliance',
        name: 'Minimisation des données',
        description: 'Collecte uniquement des données nécessaires',
        status: 'completed',
        priority: 'medium',
        evidence: 'Design centré sur les directives anticipées'
      },
      {
        id: 'access-controls',
        category: 'compliance',
        name: 'Contrôles d\'accès',
        description: 'RLS et contrôles d\'accès granulaires',
        status: 'completed',
        priority: 'critical',
        evidence: 'RLS Supabase activé'
      },

      // Infrastructure
      {
        id: 'database-security',
        category: 'infrastructure',
        name: 'Sécurité base de données',
        description: 'Configuration sécurisée de la base de données',
        status: 'completed',
        priority: 'critical',
        evidence: 'Supabase sécurisé par défaut'
      },
      {
        id: 'backup-strategy',
        category: 'infrastructure',
        name: 'Stratégie de sauvegarde',
        description: 'Sauvegardes automatiques et plan de restauration',
        status: 'completed',
        priority: 'high',
        evidence: 'Sauvegardes Supabase automatiques'
      },
      {
        id: 'network-security',
        category: 'infrastructure',
        name: 'Sécurité réseau',
        description: 'Pare-feu et segmentation réseau',
        status: 'completed',
        priority: 'high',
        evidence: 'Infrastructure Scalingo sécurisée'
      },
      {
        id: 'environment-config',
        category: 'infrastructure',
        name: 'Configuration environnement',
        description: 'Variables d\'environnement et configuration production',
        status: 'pending',
        priority: 'high'
      },

      // Monitoring
      {
        id: 'logging-system',
        category: 'monitoring',
        name: 'Système de journalisation',
        description: 'Logs d\'audit et de sécurité centralisés',
        status: 'in-progress',
        priority: 'high',
        notes: 'Logs basiques en place, amélioration nécessaire'
      },
      {
        id: 'monitoring-alerts',
        category: 'monitoring',
        name: 'Alertes de monitoring',
        description: 'Système d\'alertes pour les incidents de sécurité',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'audit-trail',
        category: 'monitoring',
        name: 'Piste d\'audit',
        description: 'Traçabilité complète des accès aux données',
        status: 'in-progress',
        priority: 'critical',
        notes: 'Traçabilité partielle, à compléter'
      },
      {
        id: 'incident-response',
        category: 'monitoring',
        name: 'Plan de réponse aux incidents',
        description: 'Procédures documentées pour la gestion des incidents',
        status: 'completed',
        priority: 'high',
        evidence: 'Procédure violation de données documentée'
      }
    ];
  }

  /**
   * Met à jour le statut d'un élément
   */
  updateItemStatus(itemId: string, status: ChecklistItem['status'], evidence?: string, notes?: string): void {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.status = status;
      if (evidence) item.evidence = evidence;
      if (notes) item.notes = notes;
    }
  }

  /**
   * Évalue automatiquement certains éléments
   */
  autoEvaluate(): void {
    // HTTPS
    const httpsItem = this.items.find(i => i.id === 'https-ssl');
    if (httpsItem) {
      const isHttps = window.location.protocol === 'https:';
      httpsItem.status = isHttps ? 'completed' : 'failed';
      httpsItem.evidence = isHttps ? 'HTTPS activé' : 'HTTP détecté';
    }

    // Environnement
    const envItem = this.items.find(i => i.id === 'environment-config');
    if (envItem) {
      const isProduction = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('lovable.app');
      envItem.status = isProduction ? 'completed' : 'pending';
      envItem.evidence = isProduction ? 'Environnement de production' : 'Environnement de développement';
    }
  }

  /**
   * Génère un rapport de déploiement
   */
  generateReport(): DeploymentReport {
    this.autoEvaluate();

    const totalItems = this.items.length;
    const completedItems = this.items.filter(i => i.status === 'completed').length;
    const completion_percentage = Math.round((completedItems / totalItems) * 100);

    const blockers = this.items.filter(i => 
      i.priority === 'critical' && (i.status === 'pending' || i.status === 'failed')
    );

    const recommendations: string[] = [];
    
    // Générer des recommandations basées sur l'état
    if (blockers.length > 0) {
      recommendations.push(`${blockers.length} élément(s) critique(s) à résoudre avant le déploiement`);
    }

    const failedItems = this.items.filter(i => i.status === 'failed');
    if (failedItems.length > 0) {
      recommendations.push('Corriger les éléments en échec');
    }

    const inProgressItems = this.items.filter(i => i.status === 'in-progress');
    if (inProgressItems.length > 0) {
      recommendations.push('Finaliser les éléments en cours');
    }

    if (completion_percentage >= 90 && blockers.length === 0) {
      recommendations.push('Application prête pour le déploiement HDS');
    }

    let overall_status: 'ready' | 'needs_attention' | 'not_ready' = 'not_ready';
    if (blockers.length === 0 && completion_percentage >= 90) {
      overall_status = 'ready';
    } else if (blockers.length === 0 && completion_percentage >= 70) {
      overall_status = 'needs_attention';
    }

    return {
      overall_status,
      completion_percentage,
      items: this.items,
      blockers,
      recommendations,
      generated_at: new Date()
    };
  }

  /**
   * Obtient les éléments par catégorie
   */
  getItemsByCategory(category: ChecklistItem['category']): ChecklistItem[] {
    return this.items.filter(item => item.category === category);
  }

  /**
   * Obtient les éléments par statut
   */
  getItemsByStatus(status: ChecklistItem['status']): ChecklistItem[] {
    return this.items.filter(item => item.status === status);
  }

  /**
   * Obtient les éléments critiques
   */
  getCriticalItems(): ChecklistItem[] {
    return this.items.filter(item => item.priority === 'critical');
  }
}

export const deploymentChecklist = new DeploymentChecklist();
