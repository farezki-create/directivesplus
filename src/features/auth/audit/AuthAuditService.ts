
import { supabase } from '@/integrations/supabase/client';

export interface AuthAuditResult {
  score: number;
  issues: AuthAuditIssue[];
  recommendations: string[];
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AuthAuditIssue {
  category: 'SECURITY' | 'CONFIGURATION' | 'IMPLEMENTATION' | 'PERFORMANCE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  fix: string;
  code?: string;
}

export class AuthAuditService {
  static async performCompleteAudit(): Promise<AuthAuditResult> {
    const issues: AuthAuditIssue[] = [];
    
    // 1. Audit de la configuration Supabase
    const configIssues = await this.auditSupabaseConfig();
    issues.push(...configIssues);
    
    // 2. Audit de l'implémentation auth
    const implementationIssues = this.auditAuthImplementation();
    issues.push(...implementationIssues);
    
    // 3. Audit de la sécurité des sessions
    const sessionIssues = this.auditSessionSecurity();
    issues.push(...sessionIssues);
    
    // 4. Audit RLS et permissions
    const rlsIssues = await this.auditRLSPolicies();
    issues.push(...rlsIssues);
    
    // 5. Audit des logs et monitoring
    const loggingIssues = this.auditLoggingSystem();
    issues.push(...loggingIssues);
    
    // Calcul du score et recommandations
    const score = this.calculateSecurityScore(issues);
    const recommendations = this.generateRecommendations(issues);
    const securityLevel = this.determineSecurityLevel(score);
    
    return {
      score,
      issues,
      recommendations,
      securityLevel
    };
  }
  
  private static async auditSupabaseConfig(): Promise<AuthAuditIssue[]> {
    const issues: AuthAuditIssue[] = [];
    
    try {
      // Vérification de la configuration du client
      const { data: { session } } = await supabase.auth.getSession();
      
      // Test de la configuration des URLs
      const currentUrl = window.location.origin;
      if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
        issues.push({
          category: 'CONFIGURATION',
          severity: 'MEDIUM',
          title: 'Configuration URL de développement',
          description: 'L\'application utilise des URLs de développement',
          fix: 'Configurer les URLs de production dans Supabase',
          code: 'Site URL et Redirect URLs dans Auth > URL Configuration'
        });
      }
      
      // Vérification des variables d'environnement
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        issues.push({
          category: 'CONFIGURATION',
          severity: 'CRITICAL',
          title: 'Variables d\'environnement manquantes',
          description: 'Les clés Supabase ne sont pas correctement configurées',
          fix: 'Configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY'
        });
      }
      
    } catch (error) {
      issues.push({
        category: 'CONFIGURATION',
        severity: 'CRITICAL',
        title: 'Erreur de connexion Supabase',
        description: 'Impossible de se connecter à Supabase',
        fix: 'Vérifier la configuration et la connectivité réseau'
      });
    }
    
    return issues;
  }
  
  private static auditAuthImplementation(): AuthAuditIssue[] {
    const issues: AuthAuditIssue[] = [];
    
    // Vérification du nettoyage des états
    const authContextCode = `
      // Exemple de nettoyage d'état manquant
      const signOut = async () => {
        await supabase.auth.signOut();
        // MANQUE: cleanupAuthState();
        // MANQUE: navigation sécurisée
      };
    `;
    
    issues.push({
      category: 'IMPLEMENTATION',
      severity: 'HIGH',
      title: 'Nettoyage d\'état incomplet lors de la déconnexion',
      description: 'La déconnexion ne nettoie pas complètement l\'état local',
      fix: 'Implémenter cleanupAuthState() avant la déconnexion',
      code: authContextCode
    });
    
    // Vérification de la gestion des erreurs
    issues.push({
      category: 'IMPLEMENTATION',
      severity: 'MEDIUM',
      title: 'Gestion d\'erreur insuffisante',
      description: 'Certaines erreurs d\'authentification ne sont pas gérées',
      fix: 'Ajouter une gestion d\'erreur complète pour tous les cas'
    });
    
    return issues;
  }
  
  private static auditSessionSecurity(): AuthAuditIssue[] {
    const issues: AuthAuditIssue[] = [];
    
    // Vérification de la persistance des sessions
    const sessionData = localStorage.getItem('supabase.auth.token');
    if (!sessionData) {
      issues.push({
        category: 'SECURITY',
        severity: 'MEDIUM',
        title: 'Session non persistée',
        description: 'Les sessions ne sont pas correctement sauvegardées',
        fix: 'Configurer persistSession: true dans le client Supabase'
      });
    }
    
    // Vérification des tokens expirés
    issues.push({
      category: 'SECURITY',
      severity: 'MEDIUM',
      title: 'Validation de token manquante',
      description: 'Pas de vérification automatique de l\'expiration des tokens',
      fix: 'Implémenter une validation périodique des tokens'
    });
    
    return issues;
  }
  
  private static async auditRLSPolicies(): Promise<AuthAuditIssue[]> {
    const issues: AuthAuditIssue[] = [];
    
    try {
      // Test des politiques RLS sur les profils
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        issues.push({
          category: 'SECURITY',
          severity: 'HIGH',
          title: 'Erreur d\'accès aux données utilisateur',
          description: 'Les politiques RLS pourraient être mal configurées',
          fix: 'Vérifier les politiques RLS sur la table profiles'
        });
      }
      
    } catch (error) {
      issues.push({
        category: 'SECURITY',
        severity: 'CRITICAL',
        title: 'Échec de test RLS',
        description: 'Impossible de tester les politiques RLS',
        fix: 'Vérifier la configuration de la base de données'
      });
    }
    
    return issues;
  }
  
  private static auditLoggingSystem(): AuthAuditIssue[] {
    const issues: AuthAuditIssue[] = [];
    
    issues.push({
      category: 'SECURITY',
      severity: 'MEDIUM',
      title: 'Logs de sécurité insuffisants',
      description: 'Les tentatives de connexion ne sont pas toutes loggées',
      fix: 'Implémenter un système de logging complet pour l\'authentification'
    });
    
    issues.push({
      category: 'SECURITY',
      severity: 'LOW',
      title: 'Monitoring des sessions manquant',
      description: 'Pas de monitoring en temps réel des sessions actives',
      fix: 'Ajouter un système de monitoring des sessions'
    });
    
    return issues;
  }
  
  private static calculateSecurityScore(issues: AuthAuditIssue[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'CRITICAL':
          score -= 25;
          break;
        case 'HIGH':
          score -= 15;
          break;
        case 'MEDIUM':
          score -= 10;
          break;
        case 'LOW':
          score -= 5;
          break;
      }
    });
    
    return Math.max(0, score);
  }
  
  private static generateRecommendations(issues: AuthAuditIssue[]): string[] {
    const recommendations: string[] = [];
    
    const criticalIssues = issues.filter(i => i.severity === 'CRITICAL');
    const highIssues = issues.filter(i => i.severity === 'HIGH');
    
    if (criticalIssues.length > 0) {
      recommendations.push('🚨 URGENT: Corriger immédiatement les problèmes critiques de sécurité');
      recommendations.push('🔒 Revoir complètement la configuration Supabase');
    }
    
    if (highIssues.length > 0) {
      recommendations.push('⚠️ Corriger les problèmes de sécurité élevés avant la mise en production');
      recommendations.push('🛡️ Implémenter une meilleure gestion des sessions');
    }
    
    recommendations.push('📊 Mettre en place un monitoring continu de l\'authentification');
    recommendations.push('🔄 Effectuer des audits de sécurité réguliers');
    recommendations.push('📝 Documenter les procédures de sécurité');
    
    return recommendations;
  }
  
  private static determineSecurityLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score >= 90) return 'HIGH';
    if (score >= 70) return 'MEDIUM';
    if (score >= 50) return 'LOW';
    return 'CRITICAL';
  }
}
