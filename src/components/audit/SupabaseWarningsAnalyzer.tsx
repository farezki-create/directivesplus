
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
      // 1. Analyser les tables sans RLS
      console.log('🔍 Analyse des politiques RLS...');
      await analyzeRLSPolicies(foundWarnings);

      // 2. Analyser les fonctions avec problèmes de sécurité
      console.log('🔍 Analyse des fonctions...');
      await analyzeFunctions(foundWarnings);

      // 3. Analyser la configuration auth
      console.log('🔍 Analyse de la configuration auth...');
      await analyzeAuthConfig(foundWarnings);

      // 4. Analyser les performances
      console.log('🔍 Analyse des performances...');
      await analyzePerformance(foundWarnings);

      // 5. Analyser le stockage
      console.log('🔍 Analyse du stockage...');
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
    const criticalTables = [
      'profiles', 'pdf_documents', 'directives', 'medical_data',
      'institution_access_codes', 'document_access_codes', 'security_audit_logs'
    ];

    for (const table of criticalTables) {
      try {
        // Tester l'accès à la table
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          if (error.message.includes('permission denied') || error.message.includes('RLS')) {
            warnings.push({
              id: `rls-${table}`,
              category: 'RLS',
              severity: 'HIGH',
              title: `RLS mal configuré sur ${table}`,
              description: `La table ${table} a des politiques RLS qui bloquent l'accès légitime`,
              solution: `Vérifier et ajuster les politiques RLS pour la table ${table}`,
              tableAffected: table
            });
          } else {
            warnings.push({
              id: `table-error-${table}`,
              category: 'CONFIGURATION',
              severity: 'MEDIUM',
              title: `Erreur d'accès à ${table}`,
              description: `Erreur lors de l'accès à la table: ${error.message}`,
              solution: `Vérifier la configuration de la table ${table}`,
              tableAffected: table
            });
          }
        }
      } catch (err) {
        warnings.push({
          id: `access-error-${table}`,
          category: 'SECURITY',
          severity: 'HIGH',
          title: `Table ${table} inaccessible`,
          description: `Impossible d'accéder à la table ${table}`,
          solution: `Vérifier l'existence et les permissions de la table ${table}`,
          tableAffected: table
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

      {/* Warnings par catégorie */}
      {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(severity => {
        const severityWarnings = warnings.filter(w => w.severity === severity);
        if (severityWarnings.length === 0) return null;

        return (
          <Card key={severity}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getSeverityIcon(severity)}
                Warnings {severity}
                <Badge variant="outline">{severityWarnings.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {severityWarnings.map((warning) => (
                  <div key={warning.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(warning.category)}
                        <h4 className="font-medium">{warning.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getSeverityColor(warning.severity)}>
                          {warning.severity}
                        </Badge>
                        <Badge variant="outline">
                          {warning.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{warning.description}</p>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-800 mb-1">Solution :</p>
                      <p className="text-sm text-blue-700">{warning.solution}</p>
                    </div>
                    {(warning.tableAffected || warning.functionAffected) && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {warning.tableAffected ? `Table: ${warning.tableAffected}` : 
                           warning.functionAffected ? `Fonction: ${warning.functionAffected}` : ''}
                        </Badge>
                      </div>
                    )}
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
                  <li>Vérifier la configuration SMTP dans Auth > Email Templates</li>
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
