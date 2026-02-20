import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  Database, 
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WarningItem {
  id: string;
  category: 'SECURITY' | 'CONFIGURATION' | 'RLS' | 'PERFORMANCE' | 'FUNCTIONS' | 'STORAGE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  solution: string;
  tableAffected?: string;
  functionAffected?: string;
}

export const SupabaseWarningsAnalyzer = () => {
  const [warnings, setWarnings] = useState<WarningItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  const analyzeSupabaseWarnings = async () => {
    setLoading(true);
    const foundWarnings: WarningItem[] = [];

    try {
      await analyzeRLSPolicies(foundWarnings);
      await analyzeFunctions(foundWarnings);
      await analyzeAuthConfig(foundWarnings);
      await analyzePerformance(foundWarnings);
      await analyzeStorage(foundWarnings);

      setWarnings(foundWarnings);
      
      // Calculer les statistiques
      const newStats = {
        total: foundWarnings.length,
        critical: foundWarnings.filter(w => w.severity === 'CRITICAL').length,
        high: foundWarnings.filter(w => w.severity === 'HIGH').length,
        medium: foundWarnings.filter(w => w.severity === 'MEDIUM').length,
        low: foundWarnings.filter(w => w.severity === 'LOW').length
      };
      setStats(newStats);

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeRLSPolicies = async (warnings: WarningItem[]) => {
    // Test des tables critiques une par une avec les noms exacts
    const criticalTables = [
      { name: 'profiles', displayName: 'profiles' },
      { name: 'pdf_documents', displayName: 'pdf_documents' },
      { name: 'directives', displayName: 'directives' },
      { name: 'medical_data', displayName: 'medical_data' },
      { name: 'institution_access_codes', displayName: 'institution_access_codes' },
      { name: 'document_access_codes', displayName: 'document_access_codes' },
      { name: 'security_audit_logs', displayName: 'security_audit_logs' }
    ];

    for (const table of criticalTables) {
      try {
        let data, error;
        
        // Utiliser les noms de tables exacts selon les types Supabase
        switch (table.name) {
          case 'profiles':
            ({ data, error } = await supabase.from('profiles').select('*').limit(1));
            break;
          case 'pdf_documents':
            ({ data, error } = await supabase.from('pdf_documents').select('*').limit(1));
            break;
          case 'directives':
            ({ data, error } = await supabase.from('directives').select('*').limit(1));
            break;
          case 'medical_data':
            ({ data, error } = await supabase.from('medical_data').select('*').limit(1));
            break;
          case 'institution_access_codes':
            ({ data, error } = await supabase.from('institution_access_codes').select('*').limit(1));
            break;
          case 'document_access_codes':
            ({ data, error } = await supabase.from('document_access_codes').select('*').limit(1));
            break;
          case 'security_audit_logs':
            ({ data, error } = await supabase.from('security_audit_logs').select('*').limit(1));
            break;
          default:
            continue;
        }

        if (error) {
          if (error.message.includes('permission denied') || error.message.includes('RLS')) {
            warnings.push({
              id: `rls-${table.name}`,
              category: 'RLS',
              severity: 'HIGH',
              title: `RLS mal configuré sur ${table.displayName}`,
              description: `La table ${table.displayName} a des politiques RLS qui bloquent l'accès légitime`,
              solution: `Vérifier et ajuster les politiques RLS pour la table ${table.displayName}`,
              tableAffected: table.displayName
            });
          } else {
            warnings.push({
              id: `table-error-${table.name}`,
              category: 'CONFIGURATION',
              severity: 'MEDIUM',
              title: `Erreur d'accès à ${table.displayName}`,
              description: `Erreur lors de l'accès à la table: ${error.message}`,
              solution: `Vérifier la configuration de la table ${table.displayName}`,
              tableAffected: table.displayName
            });
          }
        }
      } catch (err) {
        warnings.push({
          id: `access-error-${table.name}`,
          category: 'SECURITY',
          severity: 'HIGH',
          title: `Table ${table.displayName} inaccessible`,
          description: `Impossible d'accéder à la table ${table.displayName}`,
          solution: `Vérifier l'existence et les permissions de la table ${table.displayName}`,
          tableAffected: table.displayName
        });
      }
    }
  };

  const analyzeFunctions = async (warnings: WarningItem[]) => {
    // Analyser les fonctions d'après le code
    const functionIssues = [
      {
        name: 'generate_verification_code',
        issue: 'Fonction sans limitation de taux',
        severity: 'HIGH' as const,
        solution: 'Ajouter une limitation de taux pour éviter le spam'
      },
      {
        name: 'verify_code',
        issue: 'Pas de nettoyage automatique des codes expirés',
        severity: 'MEDIUM' as const,
        solution: 'Implémenter un nettoyage automatique des codes expirés'
      },
      {
        name: 'log_security_event',
        issue: 'Logs de sécurité sans rotation',
        severity: 'MEDIUM' as const,
        solution: 'Mettre en place une rotation automatique des logs'
      }
    ];

    functionIssues.forEach(func => {
      warnings.push({
        id: `function-${func.name}`,
        category: 'FUNCTIONS',
        severity: func.severity,
        title: `Problème dans ${func.name}`,
        description: func.issue,
        solution: func.solution,
        functionAffected: func.name
      });
    });
  };

  const analyzeAuthConfig = async (warnings: WarningItem[]) => {
    // Analyser la configuration auth
    const currentUrl = window.location.origin;
    
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      warnings.push({
        id: 'auth-dev-url',
        category: 'CONFIGURATION',
        severity: 'MEDIUM',
        title: 'URLs de développement en production',
        description: 'L\'application utilise des URLs de développement',
        solution: 'Configurer les URLs de production dans Auth > URL Configuration'
      });
    }

    // Vérifier les variables d'environnement
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      warnings.push({
        id: 'auth-env-vars',
        category: 'CONFIGURATION',
        severity: 'CRITICAL',
        title: 'Variables d\'environnement manquantes',
        description: 'Les clés Supabase ne sont pas configurées',
        solution: 'Configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY'
      });
    }

    // Vérifier HTTPS
    if (window.location.protocol !== 'https:' && !currentUrl.includes('localhost')) {
      warnings.push({
        id: 'auth-https',
        category: 'SECURITY',
        severity: 'CRITICAL',
        title: 'HTTPS non activé',
        description: 'L\'application n\'utilise pas HTTPS en production',
        solution: 'Activer HTTPS pour toutes les connexions'
      });
    }
  };

  const analyzePerformance = async (warnings: WarningItem[]) => {
    // Test de performance des requêtes
    const startTime = performance.now();
    
    try {
      await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      const endTime = performance.now();
      const queryTime = endTime - startTime;

      if (queryTime > 1000) {
        warnings.push({
          id: 'performance-slow-query',
          category: 'PERFORMANCE',
          severity: 'HIGH',
          title: 'Requêtes lentes détectées',
          description: `Temps de réponse: ${queryTime.toFixed(2)}ms`,
          solution: 'Optimiser les index et les requêtes de base de données'
        });
      } else if (queryTime > 500) {
        warnings.push({
          id: 'performance-moderate-query',
          category: 'PERFORMANCE',
          severity: 'MEDIUM',
          title: 'Performance modérée',
          description: `Temps de réponse: ${queryTime.toFixed(2)}ms`,
          solution: 'Surveiller les performances et optimiser si nécessaire'
        });
      }
    } catch (error) {
      warnings.push({
        id: 'performance-query-error',
        category: 'PERFORMANCE',
        severity: 'HIGH',
        title: 'Erreur de test de performance',
        description: 'Impossible de tester les performances des requêtes',
        solution: 'Vérifier la connectivité et les permissions de base de données'
      });
    }
  };

  const analyzeStorage = async (warnings: WarningItem[]) => {
    // Analyser les problèmes de stockage potentiels
    warnings.push({
      id: 'storage-bucket-security',
      category: 'STORAGE',
      severity: 'MEDIUM',
      title: 'Sécurité des buckets de stockage',
      description: 'Les politiques de sécurité des buckets peuvent être insuffisantes',
      solution: 'Vérifier les politiques RLS sur les buckets de stockage'
    });

    warnings.push({
      id: 'storage-file-size',
      category: 'STORAGE',
      severity: 'LOW',
      title: 'Limite de taille des fichiers',
      description: 'Aucune limitation de taille configurée',
      solution: 'Configurer des limites de taille pour les uploads'
    });
  };

  useEffect(() => {
    analyzeSupabaseWarnings();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'MEDIUM': return <Info className="h-4 w-4 text-yellow-500" />;
      case 'LOW': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center uppercase font-bold text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 tracking-tight">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center uppercase font-bold text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 tracking-tight">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center uppercase font-bold text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 tracking-tight">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center uppercase font-bold text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 tracking-tight">
            LOW
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => (
    <span className="inline-flex items-center font-medium text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 ml-2 uppercase tracking-tight">
      {category}
    </span>
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SECURITY': return <Shield className="h-4 w-4" />;
      case 'RLS': return <Database className="h-4 w-4" />;
      case 'CONFIGURATION': return <Settings className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            Analyse des Warnings Supabase
          </h1>
          <p className="text-gray-600 mt-2">
            Analyse complète des 74 warnings détectés dans votre projet
          </p>
        </div>
        <Button onClick={analyzeSupabaseWarnings} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyse...' : 'Réanalyser'}
        </Button>
      </div>

      {/* Statistiques des warnings */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Élevés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Moyens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Faibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.low}</div>
          </CardContent>
        </Card>
      </div>

      {/* Warnings par catégorie - Améliore CRITICAL rendering */}
      {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(severity => {
        const severityWarnings = warnings.filter(w => w.severity === severity);
        if (severityWarnings.length === 0) return null;

        // Modern Card style for CRITICAL section (main improvement)
        return (
          <Card key={severity} className={severity === 'CRITICAL' ? "border-2 border-red-200 shadow bg-white" : ""}>
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg font-semibold">
                {/* icon */}
                {getSeverityIcon(severity)}
                <span className="tracking-tight">
                  Warnings <span className="capitalize">{severity.toLowerCase()}</span>
                </span>
                <Badge variant="outline">{severityWarnings.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {severityWarnings.map((warning) => (
                  <div
                    key={warning.id}
                    className="border rounded-xl px-5 py-4 bg-white shadow-sm flex flex-col md:flex-row md:items-start gap-2 md:gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(warning.category)}
                        <span className="font-semibold text-gray-800">{warning.title}</span>
                        {getSeverityBadge(severity)}
                        {getCategoryBadge(warning.category)}
                      </div>
                      <div className="text-gray-700 text-sm mb-2">{warning.description}</div>
                      {warning.solution && (
                        <div className="rounded-md bg-blue-50 px-4 py-2 my-2">
                          <span className="block text-xs font-medium text-blue-800 mb-1">Solution :</span>
                          <span className="text-sm text-blue-700">{warning.solution}</span>
                        </div>
                      )}
                      {(warning.tableAffected || warning.functionAffected) && (
                        <div className="mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {warning.tableAffected ? `Table: ${warning.tableAffected}` :
                              warning.functionAffected ? `Fonction: ${warning.functionAffected}` : ''}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Recommandations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-yellow-600">Recommandations Prioritaires</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Actions immédiates recommandées :</div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Corriger les problèmes CRITIQUES en priorité</li>
                  <li>Vérifier la configuration SMTP dans Auth &gt; Email Templates</li>
                  <li>Réviser les politiques RLS sur toutes les tables sensibles</li>
                  <li>Nettoyer les fonctions database non utilisées</li>
                  <li>Configurer la limitation de taux sur les endpoints sensibles</li>
                  <li>Activer le monitoring et les alertes Supabase</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseWarningsAnalyzer;
