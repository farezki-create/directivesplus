
export interface SecurityRecommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'authentication' | 'infrastructure' | 'compliance' | 'performance';
  title: string;
  description: string;
  implementation: {
    effort: 'low' | 'medium' | 'high';
    timeline: string;
    steps: string[];
    riskOfImplementation: 'low' | 'medium' | 'high';
  };
  scalingoSpecific: boolean;
  hdsCompliance: boolean;
}

export const SECURITY_RECOMMENDATIONS: SecurityRecommendation[] = [
  {
    id: 'auth-session-timeout',
    priority: 'critical',
    category: 'authentication',
    title: 'Réduire le timeout des sessions médicales',
    description: 'Les sessions de 24h sont trop longues pour des données médicales sensibles. Recommandation HDS: 8h maximum.',
    implementation: {
      effort: 'low',
      timeline: '1-2 jours',
      steps: [
        'Modifier la configuration Supabase pour timeout 8h',
        'Implémenter auto-lock après 30min inactivité',
        'Ajouter warning avant expiration',
        'Tester en environnement staging'
      ],
      riskOfImplementation: 'low'
    },
    scalingoSpecific: false,
    hdsCompliance: true
  },
  {
    id: 'rate-limiting-scalingo',
    priority: 'high',
    category: 'infrastructure',
    title: 'Rate limiting adaptatif pour Scalingo',
    description: 'Optimiser le rate limiting pour l\'environnement Scalingo HDS avec des limites spécifiques par endpoint.',
    implementation: {
      effort: 'medium',
      timeline: '3-5 jours',
      steps: [
        'Configurer nginx rate limiting sur Scalingo',
        'Implémenter limits différenciés par endpoint',
        'Auth: 5 req/min, Docs: 20 req/min, API: 100 req/min',
        'Monitoring des dépassements',
        'Alertes automatiques'
      ],
      riskOfImplementation: 'medium'
    },
    scalingoSpecific: true,
    hdsCompliance: true
  },
  {
    id: 'enhanced-logging-hds',
    priority: 'high',
    category: 'compliance',
    title: 'Logs d\'audit HDS complets',
    description: 'Enrichir les logs pour conformité HDS complète avec contexte médical et traçabilité.',
    implementation: {
      effort: 'medium',
      timeline: '5-7 jours',
      steps: [
        'Ajouter champs contexte médical aux logs',
        'Implémenter log retention 3 ans minimum',
        'Chiffrement des logs sensibles',
        'Export automatique pour audit externe',
        'Dashboard monitoring conformité'
      ],
      riskOfImplementation: 'low'
    },
    scalingoSpecific: false,
    hdsCompliance: true
  },
  {
    id: 'waf-configuration',
    priority: 'high',
    category: 'infrastructure',
    title: 'Configuration WAF Scalingo',
    description: 'Activer et configurer le Web Application Firewall pour protection avancée.',
    implementation: {
      effort: 'medium',
      timeline: '2-3 jours',
      steps: [
        'Activer WAF dans console Scalingo',
        'Configurer règles OWASP Core Rule Set',
        'Whitelist IPs institutions partenaires',
        'Monitoring des tentatives bloquées',
        'Fine-tuning des règles'
      ],
      riskOfImplementation: 'medium'
    },
    scalingoSpecific: true,
    hdsCompliance: true
  },
  {
    id: 'encryption-keys-rotation',
    priority: 'medium',
    category: 'authentication',
    title: 'Rotation automatique des clés',
    description: 'Implémenter la rotation automatique des clés de chiffrement tous les 90 jours.',
    implementation: {
      effort: 'high',
      timeline: '1-2 semaines',
      steps: [
        'Développer système de rotation de clés',
        'Backward compatibility pour anciennes clés',
        'Automation via cron jobs Scalingo',
        'Notifications équipe technique',
        'Procédure de rollback'
      ],
      riskOfImplementation: 'high'
    },
    scalingoSpecific: false,
    hdsCompliance: true
  },
  {
    id: 'monitoring-realtime',
    priority: 'medium',
    category: 'infrastructure',
    title: 'Monitoring temps réel Scalingo',
    description: 'Mise en place monitoring avancé avec alertes temps réel sur métriques critiques.',
    implementation: {
      effort: 'medium',
      timeline: '1 semaine',
      steps: [
        'Configuration monitoring Scalingo avancé',
        'Intégration avec système d\'alertes externe',
        'Métriques custom: accès données médicales',
        'Dashboard temps réel sécurité',
        'Escalation automatique incidents'
      ],
      riskOfImplementation: 'low'
    },
    scalingoSpecific: true,
    hdsCompliance: false
  },
  {
    id: 'backup-security-enhanced',
    priority: 'medium',
    category: 'infrastructure',
    title: 'Sécurisation backups Scalingo',
    description: 'Renforcer la sécurité des backups avec chiffrement additionnel et tests de restore.',
    implementation: {
      effort: 'medium',
      timeline: '3-4 jours',
      steps: [
        'Chiffrement backup avec clés dédiées',
        'Tests de restore automatisés hebdomadaires',
        'Stockage backup géographiquement distribué',
        'Audit trail sur accès aux backups',
        'Procédure de disaster recovery'
      ],
      riskOfImplementation: 'low'
    },
    scalingoSpecific: true,
    hdsCompliance: true
  },
  {
    id: 'input-validation-server',
    priority: 'medium',
    category: 'authentication',
    title: 'Validation serveur systématique',
    description: 'Dupliquer toutes les validations côté serveur pour sécurité renforcée.',
    implementation: {
      effort: 'medium',
      timeline: '1 semaine',
      steps: [
        'Audit de toutes les validations côté client',
        'Implémentation miroir côté serveur',
        'Tests automatisés de bypass validation',
        'Logging des tentatives de bypass',
        'Réponses d\'erreur standardisées'
      ],
      riskOfImplementation: 'low'
    },
    scalingoSpecific: false,
    hdsCompliance: true
  }
];

export const getRecommendationsByPriority = (priority: 'critical' | 'high' | 'medium' | 'low') => {
  return SECURITY_RECOMMENDATIONS.filter(rec => rec.priority === priority);
};

export const getHDSRecommendations = () => {
  return SECURITY_RECOMMENDATIONS.filter(rec => rec.hdsCompliance);
};

export const getScalingoRecommendations = () => {
  return SECURITY_RECOMMENDATIONS.filter(rec => rec.scalingoSpecific);
};

export const estimateImplementationTime = (recommendations: SecurityRecommendation[]) => {
  const effortToHours = {
    low: 8,
    medium: 24,
    high: 80
  };
  
  return recommendations.reduce((total, rec) => {
    return total + effortToHours[rec.implementation.effort];
  }, 0);
};
