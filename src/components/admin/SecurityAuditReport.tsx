
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Download,
  RefreshCw,
  Clock,
  TrendingUp,
  Database,
  Lock,
  FileText
} from "lucide-react";
import { auditManager, type AuditReport } from "@/utils/security/auditManager";
import { securityMonitor } from "@/utils/security/securityMonitor";
import { deploymentChecklist } from "@/utils/security/deploymentChecklist";

const SecurityAuditReport = () => {
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<any>(null);

  useEffect(() => {
    // Charger l'état de déploiement
    const status = auditManager.getDeploymentReadiness();
    setDeploymentStatus(status);
  }, []);

  const runFullAudit = async () => {
    setIsRunning(true);
    try {
      console.log("🔍 Lancement de l'audit complet...");
      const report = await auditManager.runFullAudit();
      setAuditReport(report);
      
      // Mettre à jour le statut de déploiement
      const status = auditManager.getDeploymentReadiness();
      setDeploymentStatus(status);
      
      console.log("✅ Audit terminé:", report);
    } catch (error) {
      console.error("❌ Erreur lors de l'audit:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const exportReport = () => {
    if (!auditReport) return;
    
    const reportData = {
      ...auditReport,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-securite-hds-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': case 'compliant': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'fail': case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': case 'compliant': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'fail': case 'critical': return <XCircle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800">✅ Conforme HDS</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Conformité Partielle</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">❌ Non Conforme</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">⏳ En Attente</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Audit de Sécurité HDS Complet
          </h1>
          <p className="text-gray-600 mt-2">
            Vérification complète avant déploiement sur Scalingo HDS
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={runFullAudit} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Audit en cours...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Lancer l'Audit Complet
              </>
            )}
          </Button>
          {auditReport && (
            <Button variant="outline" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          )}
        </div>
      </div>

      {/* Statut de déploiement */}
      {deploymentStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Statut de Déploiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                {deploymentStatus.ready ? (
                  <Badge className="bg-green-100 text-green-800">
                    ✅ Prêt pour le déploiement
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    ❌ Déploiement bloqué
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {deploymentStatus.blockers.length} bloqueur(s) • {deploymentStatus.warnings.length} avertissement(s)
              </div>
            </div>
            
            {deploymentStatus.blockers.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Bloqueurs critiques :</h4>
                <ul className="list-disc list-inside text-red-700 text-sm">
                  {deploymentStatus.blockers.map((blocker: string, idx: number) => (
                    <li key={idx}>{blocker}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Résumé de l'audit */}
      {auditReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Résumé de l'Audit
              </div>
              {getComplianceStatusBadge(auditReport.complianceStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {auditReport.overallScore}%
                </div>
                <div className="text-sm text-gray-600">Score Global</div>
                <Progress value={auditReport.overallScore} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {auditReport.categories.filter(c => c.status === 'pass').length}
                </div>
                <div className="text-sm text-gray-600">Catégories Conformes</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {auditReport.categories.filter(c => c.status === 'warning').length}
                </div>
                <div className="text-sm text-gray-600">Avertissements</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {auditReport.criticalIssues.length}
                </div>
                <div className="text-sm text-gray-600">Problèmes Critiques</div>
              </div>
            </div>

            {/* Conformité HDS */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Conformité HDS Détaillée</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {auditReport.hdsCompliance.score}%
                  </div>
                  <div className="text-sm text-blue-700">Score HDS</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {auditReport.hdsCompliance.requirements.filter(r => r.status === 'compliant').length} / {auditReport.hdsCompliance.requirements.length}
                  </div>
                  <div className="text-sm text-blue-700">Exigences Conformes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Détail des catégories */}
      {auditReport && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {auditReport.categories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.name === 'Sécurité Technique' && <Lock className="w-5 h-5" />}
                    {category.name === 'Conformité RGPD/HDS' && <Shield className="w-5 h-5" />}
                    {category.name === 'Infrastructure' && <Database className="w-5 h-5" />}
                    {category.name === 'Données et Accès' && <FileText className="w-5 h-5" />}
                    {category.name === 'Journalisation' && <Clock className="w-5 h-5" />}
                    {category.name}
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(category.status)}`}>
                    {getStatusIcon(category.status)}
                    <span className="text-sm font-medium">{category.score}%</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={category.score} className="mb-4" />
                
                <div className="space-y-2">
                  {category.checks.map((check, checkIndex) => (
                    <div key={checkIndex} className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className={getStatusColor(check.status)}>
                          {getStatusIcon(check.status)}
                        </div>
                        <span className="text-sm font-medium">{check.name}</span>
                      </div>
                      {check.fix && (
                        <Badge variant="outline" className="text-xs">
                          Action requise
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Problèmes critiques */}
      {auditReport && auditReport.criticalIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Problèmes Critiques ({auditReport.criticalIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditReport.criticalIssues.map((issue, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="font-medium">{issue.description}</div>
                      <div className="text-sm opacity-90">Impact: {issue.impact}</div>
                      <div className="text-sm opacity-90">Solution: {issue.solution}</div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommandations */}
      {auditReport && auditReport.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {auditReport.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                  <div className="text-blue-600 mt-0.5">💡</div>
                  <div className="text-sm text-blue-800">{recommendation}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions de déploiement */}
      {auditReport && auditReport.readyForProduction && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Prêt pour le Déploiement HDS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">✅ Toutes les vérifications de sécurité sont passées avec succès.</div>
                  <div className="mt-2 text-sm">
                    Votre application est conforme aux exigences HDS et peut être déployée sur Scalingo HDS.
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Étapes suivantes :</h4>
                <ol className="list-decimal list-inside text-green-700 text-sm space-y-1">
                  <li>Configurer l'environnement Scalingo HDS</li>
                  <li>Déployer l'application</li>
                  <li>Effectuer les tests de validation en production</li>
                  <li>Activer le monitoring de sécurité continu</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityAuditReport;
