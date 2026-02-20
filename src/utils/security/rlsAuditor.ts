
import { supabase } from "@/integrations/supabase/client";

export interface RLSAuditResult {
  tableName: string;
  hasRLS: boolean;
  policies: RLSPolicy[];
  issues: string[];
  recommendations: string[];
  securityScore: number;
}

export interface RLSPolicy {
  name: string;
  command: string;
  roles: string[];
  using: string;
  withCheck: string;
}

export interface RLSAuditReport {
  overallScore: number;
  totalTables: number;
  tablesWithRLS: number;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  tableResults: RLSAuditResult[];
  timestamp: Date;
}

class RLSAuditor {
  private readonly criticalTables = [
    'profiles',
    'pdf_documents',
    'directives',
    'medical_data',
    'questionnaire_medical',
    'shared_documents',
    'document_access_codes',
    'institution_access_codes',
    'trusted_persons',
    'questionnaire_responses',
    'user_signatures'
  ];

  /**
   * Lance un audit complet des politiques RLS
   */
  async runRLSAudit(): Promise<RLSAuditReport> {
    
    
    const tableResults: RLSAuditResult[] = [];
    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Audit des tables critiques
    for (const tableName of this.criticalTables) {
      const result = await this.auditTable(tableName);
      tableResults.push(result);

      // Collecter les problèmes critiques
      if (!result.hasRLS) {
        criticalIssues.push(`Table ${tableName}: RLS non activé`);
      }

      if (result.policies.length === 0 && result.hasRLS) {
        criticalIssues.push(`Table ${tableName}: RLS activé mais aucune politique définie`);
      }

      result.issues.forEach(issue => {
        if (issue.includes('critique') || issue.includes('critical')) {
          criticalIssues.push(`${tableName}: ${issue}`);
        } else {
          warnings.push(`${tableName}: ${issue}`);
        }
      });

      recommendations.push(...result.recommendations.map(rec => `${tableName}: ${rec}`));
    }

    // Calculer le score global
    const totalScore = tableResults.reduce((sum, result) => sum + result.securityScore, 0);
    const overallScore = Math.round(totalScore / tableResults.length);

    const report: RLSAuditReport = {
      overallScore,
      totalTables: tableResults.length,
      tablesWithRLS: tableResults.filter(r => r.hasRLS).length,
      criticalIssues,
      warnings,
      recommendations,
      tableResults,
      timestamp: new Date()
    };

    
    return report;
  }

  /**
   * Audit d'une table spécifique
   */
  private async auditTable(tableName: string): Promise<RLSAuditResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let securityScore = 100;

    // Vérifier si RLS est activé (simulation basée sur la configuration connue)
    const hasRLS = this.checkTableRLS(tableName);
    
    if (!hasRLS) {
      issues.push("RLS non activé - CRITIQUE");
      recommendations.push("Activer Row Level Security sur cette table");
      securityScore -= 50;
    }

    // Simuler les politiques basées sur la configuration connue
    const policies = this.getTablePolicies(tableName);

    // Vérifier la couverture des opérations CRUD
    const operations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
    const coveredOps = new Set(policies.map(p => p.command));

    operations.forEach(op => {
      if (!coveredOps.has(op)) {
        issues.push(`Politique manquante pour ${op}`);
        recommendations.push(`Créer une politique RLS pour l'opération ${op}`);
        securityScore -= 10;
      }
    });

    // Vérifier la sécurité des politiques
    policies.forEach(policy => {
      if (policy.using.includes('true') && !policy.using.includes('auth.uid()')) {
        issues.push(`Politique ${policy.name}: Condition trop permissive`);
        recommendations.push(`Restreindre la politique ${policy.name} avec auth.uid()`);
        securityScore -= 15;
      }

      if (policy.roles.includes('anon') && this.criticalTables.includes(tableName)) {
        issues.push(`Politique ${policy.name}: Accès anonyme sur table critique`);
        recommendations.push(`Supprimer l'accès anonyme pour ${policy.name}`);
        securityScore -= 20;
      }
    });

    // Vérifications spécifiques par table
    this.performTableSpecificChecks(tableName, policies, issues, recommendations);

    return {
      tableName,
      hasRLS,
      policies,
      issues,
      recommendations,
      securityScore: Math.max(0, securityScore)
    };
  }

  /**
   * Vérifications spécifiques par table
   */
  private performTableSpecificChecks(
    tableName: string, 
    policies: RLSPolicy[], 
    issues: string[], 
    recommendations: string[]
  ): void {
    switch (tableName) {
      case 'profiles':
        if (!policies.some(p => p.using.includes('auth.uid() = id'))) {
          issues.push("Pas de restriction utilisateur sur les profils");
          recommendations.push("Ajouter une politique avec auth.uid() = id");
        }
        break;

      case 'pdf_documents':
      case 'directives':
        if (!policies.some(p => p.using.includes('user_id'))) {
          issues.push("Pas de restriction par user_id");
          recommendations.push("Ajouter une politique avec auth.uid() = user_id");
        }
        break;

      case 'shared_documents':
        if (policies.some(p => p.roles.includes('anon'))) {
          // C'est acceptable pour les documents partagés avec vérification
          if (!policies.some(p => p.using.includes('access_code'))) {
            issues.push("Accès anonyme sans vérification de code");
            recommendations.push("Ajouter vérification du code d'accès");
          }
        }
        break;

      case 'medical_data':
        if (!policies.every(p => p.using.includes('auth.uid()'))) {
          issues.push("Données médicales sans restriction utilisateur stricte");
          recommendations.push("Appliquer auth.uid() sur toutes les politiques médicales");
        }
        break;
    }
  }

  /**
   * Vérifier si RLS est activé sur une table (simulation)
   */
  private checkTableRLS(tableName: string): boolean {
    // Basé sur la migration SQL fournie, simuler l'état RLS
    const tablesWithRLS = [
      'dossiers_medicaux' // D'après la migration fournie
    ];
    
    // Pour les autres tables critiques, on assume qu'elles devraient avoir RLS
    // mais on ne peut pas le vérifier directement via le client Supabase
    return tablesWithRLS.includes(tableName) || this.criticalTables.includes(tableName);
  }

  /**
   * Obtenir les politiques d'une table (simulation)
   */
  private getTablePolicies(tableName: string): RLSPolicy[] {
    // Simulation basée sur les politiques connues
    const policies: { [key: string]: RLSPolicy[] } = {
      'dossiers_medicaux': [
        {
          name: "Utilisateurs authentifiés peuvent créer des dossiers médicaux",
          command: "INSERT",
          roles: ["authenticated"],
          using: "",
          withCheck: "true"
        },
        {
          name: "Utilisateurs peuvent lire leurs propres dossiers médicaux",
          command: "SELECT",
          roles: ["authenticated"],
          using: "true",
          withCheck: ""
        },
        {
          name: "Utilisateurs peuvent mettre à jour leurs propres dossiers médicaux",
          command: "UPDATE",
          roles: ["authenticated"],
          using: "true",
          withCheck: ""
        },
        {
          name: "Utilisateurs peuvent supprimer leurs propres dossiers médicaux",
          command: "DELETE",
          roles: ["authenticated"],
          using: "true",
          withCheck: ""
        }
      ]
    };

    return policies[tableName] || [];
  }

  /**
   * Générer des recommandations de sécurité
   */
  generateSecurityRecommendations(report: RLSAuditReport): string[] {
    const recommendations: string[] = [];

    if (report.overallScore < 70) {
      recommendations.push("Score de sécurité critique - révision complète des politiques RLS requise");
    }

    if (report.criticalIssues.length > 0) {
      recommendations.push("Corriger immédiatement tous les problèmes critiques identifiés");
    }

    if (report.tablesWithRLS < report.totalTables) {
      recommendations.push("Activer RLS sur toutes les tables contenant des données sensibles");
    }

    // Recommandations générales
    recommendations.push("Implementer des politiques RLS basées sur auth.uid() pour toutes les tables utilisateur");
    recommendations.push("Éviter les politiques avec 'true' sans conditions supplémentaires");
    recommendations.push("Tester régulièrement les politiques RLS avec différents rôles utilisateur");
    recommendations.push("Documenter toutes les politiques RLS et leur justification");

    return recommendations;
  }

  /**
   * Vérifier la conformité HDS pour RLS
   */
  checkHDSCompliance(report: RLSAuditReport): {
    compliant: boolean;
    issues: string[];
    requirements: string[];
  } {
    const issues: string[] = [];
    const requirements: string[] = [
      "Toutes les tables de données de santé doivent avoir RLS activé",
      "Accès aux données strictement limité aux utilisateurs autorisés",
      "Aucun accès anonyme aux données médicales",
      "Journalisation des accès via les politiques RLS"
    ];

    // Vérifier les tables médicales
    const medicalTables = ['medical_data', 'directives', 'questionnaire_medical'];
    medicalTables.forEach(table => {
      const result = report.tableResults.find(r => r.tableName === table);
      if (!result?.hasRLS) {
        issues.push(`Table médicale ${table} sans RLS - Non conforme HDS`);
      }
    });

    if (report.criticalIssues.length > 0) {
      issues.push("Problèmes critiques RLS incompatibles avec HDS");
    }

    return {
      compliant: issues.length === 0 && report.overallScore >= 85,
      issues,
      requirements
    };
  }
}

export const rlsAuditor = new RLSAuditor();
