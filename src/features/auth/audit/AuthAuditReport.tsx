
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  RefreshCw,
  Download
} from 'lucide-react';
import { AuthAuditService, AuthAuditResult, AuthAuditIssue } from './AuthAuditService';

export const AuthAuditReport = () => {
  const [auditResult, setAuditResult] = useState<AuthAuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const result = await AuthAuditService.performCompleteAudit();
      setAuditResult(result);
    } catch (error) {
      console.error('Erreur lors de l\'audit:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'MEDIUM':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'LOW':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'secondary';
      case 'LOW':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportReport = () => {
    if (!auditResult) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      score: auditResult.score,
      securityLevel: auditResult.securityLevel,
      issues: auditResult.issues,
      recommendations: auditResult.recommendations
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth-audit-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Audit en cours...</span>
        </div>
      </div>
    );
  }

  if (!auditResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Aucun audit disponible</p>
            <Button onClick={runAudit}>
              <Shield className="mr-2 h-4 w-4" />
              Lancer l'audit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Audit de Sécurité Authentification
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={runAudit}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Relancer
              </Button>
              <Button variant="outline" onClick={exportReport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {auditResult.score}/100
              </div>
              <div className="text-sm text-gray-500">Score de Sécurité</div>
            </div>
            <div className="text-center">
              <Badge className={getSecurityLevelColor(auditResult.securityLevel)}>
                {auditResult.securityLevel}
              </Badge>
              <div className="text-sm text-gray-500 mt-1">Niveau de Sécurité</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {auditResult.issues.length}
              </div>
              <div className="text-sm text-gray-500">Problèmes détectés</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      {auditResult.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommandations Prioritaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {auditResult.recommendations.map((rec, index) => (
                <Alert key={index}>
                  <AlertDescription>{rec}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problèmes détectés */}
      <Card>
        <CardHeader>
          <CardTitle>Problèmes Détectés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditResult.issues.map((issue, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {getSeverityIcon(issue.severity)}
                    <h4 className="font-medium ml-2">{issue.title}</h4>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getSeverityColor(issue.severity) as any}>
                      {issue.severity}
                    </Badge>
                    <Badge variant="outline">
                      {issue.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{issue.description}</p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-medium text-blue-800 mb-1">Solution :</p>
                  <p className="text-sm text-blue-700">{issue.fix}</p>
                </div>
                {issue.code && (
                  <div className="bg-gray-100 p-3 rounded mt-2">
                    <pre className="text-xs overflow-x-auto">{issue.code}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Résumé par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé par Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['SECURITY', 'CONFIGURATION', 'IMPLEMENTATION', 'PERFORMANCE'].map(category => {
              const categoryIssues = auditResult.issues.filter(i => i.category === category);
              return (
                <div key={category} className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold">
                    {categoryIssues.length}
                  </div>
                  <div className="text-sm text-gray-500">{category}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
