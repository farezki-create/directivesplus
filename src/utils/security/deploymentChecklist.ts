
/**
 * Liste de contrôle pour le déploiement sécurisé sur Scalingo HDS
 */

export interface DeploymentCheckItem {
  id: string;
  category: 'security' | 'compliance' | 'infrastructure' | 'monitoring';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  documentation?: string;
  verificationSteps: string[];
}

export const HDS_DEPLOYMENT_CHECKLIST: DeploymentCheckItem[] = [
  // Sécurité
  {
    id: 'sec-001',
    category: 'security',
    title: 'Configuration HTTPS/TLS',
    description: 'Vérifier que HTTPS est forcé et correctement configuré',
    priority: 'critical',
    status: 'pending',
    verificationSteps: [
      'Vérifier le certificat SSL/TLS',
      'Tester la redirection HTTP vers HTTPS',
      'Valider la configuration HSTS',
      'Vérifier l\'absence de mixed content'
    ]
  },
  {
    id: 'sec-002',
    category: 'security',
    title: 'Headers de Sécurité',
    description: 'Configurer tous les headers de sécurité requis',
    priority: 'critical',
    status: 'pending',
    verificationSteps: [
      'Vérifier Content-Security-Policy',
      'Valider X-Frame-Options',
      'Confirmer X-Content-Type-Options',
      'Tester Referrer-Policy'
    ]
  },
  {
    id: 'sec-003',
    category: 'security',
    title: 'Rate Limiting',
    description: 'Activer la limitation de débit sur toutes les routes sensibles',
    priority: 'high',
    status: 'pending',
    verificationSteps: [
      'Configurer les limites par endpoint',
      'Tester la limitation en conditions réelles',
      'Vérifier les messages d\'erreur appropriés'
    ]
  },
  {
    id: 'sec-004',
    category: 'security',
    title: 'Gestion des Erreurs',
    description: 'S\'assurer que les erreurs ne révèlent pas d\'informations sensibles',
    priority: 'high',
    status: 'pending',
    verificationSteps: [
      'Tester les pages d\'erreur 404/500',
      'Vérifier que les stack traces sont masquées',
      'Valider les messages d\'erreur sanitisés'
    ]
  },

  // Conformité
  {
    id: 'comp-001',
    category: 'compliance',
    title: 'Audit de Conformité HDS',
    description: 'Exécuter l\'audit complet de conformité HDS',
    priority: 'critical',
    status: 'pending',
    verificationSteps: [
      'Lancer l\'audit de sécurité complet',
      'Obtenir un score minimal de 85%',
      'Résoudre tous les problèmes critiques',
      'Documenter les mesures compensatoires'
    ]
  },
  {
    id: 'comp-002',
    category: 'compliance',
    title: 'Protection des Données RGPD',
    description: 'Vérifier la conformité RGPD complète',
    priority: 'critical',
    status: 'pending',
    verificationSteps: [
      'Valider les bases légales de traitement',
      'Vérifier les mécanismes de consentement',
      'Tester les droits des utilisateurs',
      'Contrôler la minimisation des données'
    ]
  },
  {
    id: 'comp-003',
    category: 'compliance',
    title: 'Journalisation des Accès',
    description: 'Configurer la journalisation complète des accès aux données de santé',
    priority: 'critical',
    status: 'pending',
    verificationSteps: [
      'Activer l\'audit trail complet',
      'Tester l\'enregistrement des accès',
      'Vérifier la rétention des logs',
      'Valider l\'intégrité des journaux'
    ]
  },
  {
    id: 'comp-004',
    category: 'compliance',
    title: 'Chiffrement des Données',
    description: 'Vérifier le chiffrement bout en bout des données sensibles',
    priority: 'critical',
    status: 'pending',
    verificationSteps: [
      'Valider le chiffrement en transit (TLS)',
      'Confirmer le chiffrement au repos',
      'Tester le chiffrement des sauvegardes',
      'Vérifier la gestion des clés'
    ]
  },

  // Infrastructure
  {
    id: 'infra-001',
    category: 'infrastructure',
    title: 'Configuration Scalingo HDS',
    description: 'Configurer l\'environnement Scalingo pour la conformité HDS',
    priority: 'critical',
    status: 'pending',
    verificationSteps: [
      'Sélectionner la région France (Paris)',
      'Activer le plan HDS-compatible',
      'Configurer les variables d\'environnement sécurisées',
      'Valider la configuration réseau'
    ]
  },
  {
    id: 'infra-002',
    category: 'infrastructure',
    title: 'Base de Données Sécurisée',
    description: 'Configurer Supabase avec les paramètres de sécurité maximale',
    priority: 'critical',
    status: 'pending',
    verificationSteps: [
      'Activer Row Level Security sur toutes les tables',
      'Configurer les politiques d\'accès',
      'Valider la sauvegarde automatique',
      'Tester la récupération de données'
    ]
  },
  {
    id: 'infra-003',
    category: 'infrastructure',
    title: 'Sauvegarde et Récupération',
    description: 'Mettre en place une stratégie de sauvegarde conforme HDS',
    priority: 'high',
    status: 'pending',
    verificationSteps: [
      'Configurer les sauvegardes automatiques',
      'Tester la procédure de récupération',
      'Vérifier le chiffrement des sauvegardes',
      'Documenter les procédures'
    ]
  },
  {
    id: 'infra-004',
    category: 'infrastructure',
    title: 'Monitoring et Alertes',
    description: 'Configurer le monitoring de sécurité et les alertes',
    priority: 'high',
    status: 'pending',
    verificationSteps: [
      'Configurer les métriques de sécurité',
      'Définir les seuils d\'alerte',
      'Tester les notifications',
      'Valider les tableaux de bord'
    ]
  },

  // Monitoring
  {
    id: 'mon-001',
    category: 'monitoring',
    title: 'Surveillance Continue',
    description: 'Mettre en place la surveillance continue de la sécurité',
    priority: 'high',
    status: 'pending',
    verificationSteps: [
      'Activer le monitoring des accès suspects',
      'Configurer la détection d\'intrusion',
      'Mettre en place l\'alerte en temps réel',
      'Tester les procédures d\'incident'
    ]
  },
  {
    id: 'mon-002',
    category: 'monitoring',
    title: 'Tableaux de Bord Sécurité',
    description: 'Créer des tableaux de bord pour le suivi de la sécurité',
    priority: 'medium',
    status: 'pending',
    verificationSteps: [
      'Configurer les KPI de sécurité',
      'Créer les rapports automatiques',
      'Valider les métriques de conformité',
      'Tester l\'exportation des données'
    ]
  },
  {
    id: 'mon-003',
    category: 'monitoring',
    title: 'Audit Périodique',
    description: 'Planifier les audits de sécurité périodiques',
    priority: 'medium',
    status: 'pending',
    verificationSteps: [
      'Planifier les audits mensuels',
      'Définir les critères d\'évaluation',
      'Configurer les rapports automatiques',
      'Valider les procédures d\'amélioration'
    ]
  }
];

/**
 * Gestionnaire de la checklist de déploiement
 */
export class DeploymentChecklistManager {
  private checklist: DeploymentCheckItem[];

  constructor() {
    this.checklist = [...HDS_DEPLOYMENT_CHECKLIST];
  }

  /**
   * Obtenir la checklist complète
   */
  getChecklist(): DeploymentCheckItem[] {
    return this.checklist;
  }

  /**
   * Obtenir les éléments par catégorie
   */
  getItemsByCategory(category: DeploymentCheckItem['category']): DeploymentCheckItem[] {
    return this.checklist.filter(item => item.category === category);
  }

  /**
   * Obtenir les éléments par priorité
   */
  getItemsByPriority(priority: DeploymentCheckItem['priority']): DeploymentCheckItem[] {
    return this.checklist.filter(item => item.priority === priority);
  }

  /**
   * Obtenir les éléments critiques non résolus
   */
  getCriticalPendingItems(): DeploymentCheckItem[] {
    return this.checklist.filter(
      item => item.priority === 'critical' && item.status !== 'completed'
    );
  }

  /**
   * Mettre à jour le statut d'un élément
   */
  updateItemStatus(id: string, status: DeploymentCheckItem['status']): void {
    const item = this.checklist.find(item => item.id === id);
    if (item) {
      item.status = status;
    }
  }

  /**
   * Calculer le pourcentage de completion
   */
  getCompletionPercentage(): number {
    const completed = this.checklist.filter(item => item.status === 'completed').length;
    return Math.round((completed / this.checklist.length) * 100);
  }

  /**
   * Vérifier si le déploiement est prêt
   */
  isReadyForDeployment(): boolean {
    const criticalItems = this.getCriticalPendingItems();
    return criticalItems.length === 0;
  }

  /**
   * Générer un rapport de déploiement
   */
  generateDeploymentReport(): {
    summary: {
      total: number;
      completed: number;
      pending: number;
      failed: number;
      completionPercentage: number;
    };
    criticalPending: DeploymentCheckItem[];
    readyForDeployment: boolean;
    recommendations: string[];
  } {
    const total = this.checklist.length;
    const completed = this.checklist.filter(item => item.status === 'completed').length;
    const pending = this.checklist.filter(item => item.status === 'pending').length;
    const failed = this.checklist.filter(item => item.status === 'failed').length;
    const criticalPending = this.getCriticalPendingItems();
    const readyForDeployment = this.isReadyForDeployment();

    const recommendations: string[] = [];
    if (!readyForDeployment) {
      recommendations.push('Résoudre tous les éléments critiques avant le déploiement');
    }
    if (failed > 0) {
      recommendations.push('Corriger les éléments en échec');
    }
    if (pending > 0) {
      recommendations.push('Compléter les éléments en attente');
    }

    return {
      summary: {
        total,
        completed,
        pending,
        failed,
        completionPercentage: this.getCompletionPercentage()
      },
      criticalPending,
      readyForDeployment,
      recommendations
    };
  }
}

export const deploymentChecklist = new DeploymentChecklistManager();
