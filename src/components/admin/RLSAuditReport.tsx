
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
  Database,
  Lock,
  Eye,
  FileText,
  Download,
  RefreshCw
} from "lucide-react";
import { rlsAuditor, type RLSAuditReport } from "@/utils/security/rlsAuditor";

const RLSAuditReportComponent = () => {
  const [auditReport, setAuditReport] = useState<RLSAuditReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const runRLSAudit = async () => {
    setIsRunning(true);
    try {
      console.log("🔍 Lancement de l'audit RLS...");
      const report = await rlsAuditor.runRLSAudit();
      setAuditReport(report);
      console.log("✅ Audit RLS terminé:", report);
    } catch (error) {
      console.error("❌ Erreur lors de l'audit RLS:", error);
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
    a.download = `audit-rls-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const hdsCompliance = auditReport ? rlsAuditor.checkHDSCompliance(auditReport) : null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Audit des Politiques RLS
          </h1>
          <p className="text-gray-600 mt-2">
            Analyse complète des politiques Row Level Security
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={runRLSAudit} 
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
                Lancer l'Audit RLS
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

      {/* Résumé de l'audit */}
      {auditReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-6 h-6" />
                Résumé de l'Audit RLS
              </div>
              <Badge className={getScoreBadgeColor(auditReport.overallScore)}>
                Score: {auditReport.overallScore}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(auditReport.overallScore)}`}>
                  {auditReport.overallScore}%
                </div>
                <div className="text-sm text-gray-600">Score Global RLS</div>
                <Progress value={auditReport.overallScore} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {auditReport.tablesWithRLS}/{auditReport.totalTables}
                </div>
                <div className="text-sm text-gray-600">Tables avec RLS</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {auditReport.criticalIssues.length}
                </div>
                <div className="text-sm text-gray-600">Problèmes Critiques</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {auditReport.warnings.length}
                </div>
                <div className="text-sm text-gray-600">Avertissements</div>
              </div>
            </div>

            {/* Conformité HDS */}
            {hdsCompliance && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Conformité HDS - RLS</h3>
                <div className="flex items-center gap-4">
                  <Badge className={hdsCompliance.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {hdsCompliance.compliant ? '✅ Conforme' : '❌ Non Conforme'}
                  </Badge>
                  {!hdsCompliance.compliant && (
                    <span className="text-sm text-red-700">
                      {hdsCompliance.issues.length} problème(s) bloquant(s)
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Problèmes critiques */}
      {auditReport && auditReport.criticalIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Problèmes Critiques RLS ({auditReport.criticalIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditReport.criticalIssues.map((issue, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{issue}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Détail par table */}
      {auditReport && (
        <Card>
          <CardHeader>
            <CardTitle>Audit par Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {auditReport.tableResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTable === result.tableName ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedTable(
                    selectedTable === result.tableName ? null : result.tableName
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span className="font-medium">{result.tableName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.hasRLS ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <Badge className={getScoreBadgeColor(result.securityScore)}>
                        {result.securityScore}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    RLS: {result.hasRLS ? 'Activé' : 'Désactivé'} • 
                    Politiques: {result.policies.length} • 
                    Problèmes: {result.issues.length}
                  </div>

                  {selectedTable === result.tableName && (
                    <div className="mt-4 space-y-3 border-t pt-3">
                      {/* Politiques */}
                      {result.policies.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Politiques RLS:</h4>
                          <div className="space-y-2">
                            {result.policies.map((policy, pIndex) => (
                              <div key={pIndex} className="text-xs bg-gray-100 p-2 rounded">
                                <div className="font-medium">{policy.name}</div>
                                <div className="text-gray-600">
                                  {policy.command} • Rôles: {policy.roles.join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Problèmes */}
                      {result.issues.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-red-600">Problèmes:</h4>
                          <ul className="text-xs space-y-1">
                            {result.issues.map((issue, iIndex) => (
                              <li key={iIndex} className="text-red-600">• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommandations */}
                      {result.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-blue-600">Recommandations:</h4>
                          <ul className="text-xs space-y-1">
                            {result.recommendations.map((rec, rIndex) => (
                              <li key={rIndex} className="text-blue-600">• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommandations générales */}
      {auditReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recommandations de Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rlsAuditor.generateSecurityRecommendations(auditReport).map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                  <div className="text-blue-600 mt-0.5">💡</div>
                  <div className="text-sm text-blue-800">{recommendation}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RLSAuditReportComponent;
