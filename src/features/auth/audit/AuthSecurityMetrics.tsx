
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { SupabaseAuthAnalyzer, SupabaseAuthAnalysis } from './SupabaseAuthAnalyzer';

export const AuthSecurityMetrics = () => {
  const [analysis, setAnalysis] = useState<SupabaseAuthAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const result = await SupabaseAuthAnalyzer.analyzeAuthentication();
        setAnalysis(result);
      } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, []);

  const calculateOverallScore = (analysis: SupabaseAuthAnalysis): number => {
    let score = 0;
    let maxScore = 0;

    // Score configuration client (25%)
    maxScore += 25;
    if (analysis.clientConfig.isConfigured) score += 10;
    if (analysis.clientConfig.hasValidKeys) score += 10;
    if (analysis.clientConfig.autoRefreshEnabled) score += 3;
    if (analysis.clientConfig.persistSessionEnabled) score += 2;

    // Score flows auth (35%)
    maxScore += 35;
    const flows = Object.values(analysis.authFlows);
    const implementedFlows = flows.filter(f => f.implemented).length;
    const secureFlows = flows.filter(f => f.isSecure).length;
    score += (implementedFlows / flows.length) * 20;
    score += (secureFlows / flows.length) * 15;

    // Score gestion sessions (25%)
    maxScore += 25;
    if (analysis.sessionManagement.persistsAcrossReloads) score += 8;
    if (analysis.sessionManagement.handlesExpiration) score += 7;
    if (analysis.sessionManagement.cleansUpOnSignOut) score += 5;
    if (analysis.sessionManagement.hasSessionValidation) score += 5;

    // Score gestion erreurs (15%)
    maxScore += 15;
    if (analysis.errorHandling.hasGlobalErrorHandler) score += 5;
    if (analysis.errorHandling.handlesNetworkErrors) score += 3;
    if (analysis.errorHandling.handlesAuthErrors) score += 4;
    if (analysis.errorHandling.providesUserFeedback) score += 3;

    return Math.round((score / maxScore) * 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Activity className="h-6 w-6 animate-pulse text-blue-600" />
            <span className="ml-2">Analyse en cours...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            Impossible de charger l'analyse
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallScore = calculateOverallScore(analysis);

  return (
    <div className="space-y-6">
      {/* Score global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Score de Sécurité Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-blue-600">
              {overallScore}%
            </div>
            <Badge variant={overallScore >= 80 ? 'default' : overallScore >= 60 ? 'secondary' : 'destructive'}>
              {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Bon' : 'À améliorer'}
            </Badge>
          </div>
          <Progress value={overallScore} className="w-full" />
        </CardContent>
      </Card>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Client */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connexion Supabase</span>
                <Badge variant={analysis.clientConfig.isConfigured ? 'default' : 'destructive'}>
                  {analysis.clientConfig.isConfigured ? 'OK' : 'Erreur'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Clés valides</span>
                <Badge variant={analysis.clientConfig.hasValidKeys ? 'default' : 'destructive'}>
                  {analysis.clientConfig.hasValidKeys ? 'OK' : 'Manquantes'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-refresh</span>
                <Badge variant={analysis.clientConfig.autoRefreshEnabled ? 'default' : 'secondary'}>
                  {analysis.clientConfig.autoRefreshEnabled ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Persistance session</span>
                <Badge variant={analysis.clientConfig.persistSessionEnabled ? 'default' : 'secondary'}>
                  {analysis.clientConfig.persistSessionEnabled ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flows d'authentification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Flows d'Authentification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analysis.authFlows).map(([flowName, flow]) => (
                <div key={flowName} className="flex items-center justify-between">
                  <span className="text-sm capitalize">
                    {flowName.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex gap-1">
                    <Badge variant={flow.implemented ? 'default' : 'destructive'} className="text-xs">
                      {flow.implemented ? 'Impl.' : 'Manquant'}
                    </Badge>
                    {flow.implemented && (
                      <Badge variant={flow.isSecure ? 'default' : 'secondary'} className="text-xs">
                        {flow.isSecure ? 'Sécurisé' : 'À sécuriser'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gestion des sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gestion des Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Persistance rechargement</span>
                <Badge variant={analysis.sessionManagement.persistsAcrossReloads ? 'default' : 'destructive'}>
                  {analysis.sessionManagement.persistsAcrossReloads ? 'OK' : 'Problème'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Gestion expiration</span>
                <Badge variant={analysis.sessionManagement.handlesExpiration ? 'default' : 'destructive'}>
                  {analysis.sessionManagement.handlesExpiration ? 'OK' : 'Manquant'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Nettoyage déconnexion</span>
                <Badge variant={analysis.sessionManagement.cleansUpOnSignOut ? 'default' : 'destructive'}>
                  {analysis.sessionManagement.cleansUpOnSignOut ? 'OK' : 'Incomplet'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Validation session</span>
                <Badge variant={analysis.sessionManagement.hasSessionValidation ? 'default' : 'destructive'}>
                  {analysis.sessionManagement.hasSessionValidation ? 'OK' : 'Manquant'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gestion des erreurs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gestion des Erreurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Gestionnaire global</span>
                <Badge variant={analysis.errorHandling.hasGlobalErrorHandler ? 'default' : 'destructive'}>
                  {analysis.errorHandling.hasGlobalErrorHandler ? 'OK' : 'Manquant'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Erreurs réseau</span>
                <Badge variant={analysis.errorHandling.handlesNetworkErrors ? 'default' : 'destructive'}>
                  {analysis.errorHandling.handlesNetworkErrors ? 'OK' : 'Manquant'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Erreurs auth</span>
                <Badge variant={analysis.errorHandling.handlesAuthErrors ? 'default' : 'destructive'}>
                  {analysis.errorHandling.handlesAuthErrors ? 'OK' : 'Manquant'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Feedback utilisateur</span>
                <Badge variant={analysis.errorHandling.providesUserFeedback ? 'default' : 'destructive'}>
                  {analysis.errorHandling.providesUserFeedback ? 'OK' : 'Manquant'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Recommandations d'Amélioration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start">
                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
