
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Download,
  RefreshCw,
  Lock,
  Database,
  Server,
  Code,
  Globe,
  FileText
} from "lucide-react";

interface SecurityIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'authentication' | 'authorization' | 'data-protection' | 'infrastructure' | 'code-security' | 'compliance';
  title: string;
  description: string;
  impact: string;
  solution: string;
  implemented: boolean;
  scalingoSpecific?: boolean;
}

interface AuditResult {
  overallScore: number;
  hdsCompliance: number;
  scalingoOptimization: number;
  issues: SecurityIssue[];
  recommendations: string[];
  auditDate: Date;
}

const SecurityAuditDashboard = () => {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const runSecurityAudit = async () => {
    setIsRunning(true);
    
    // Simulation d'audit complet - remplacer par vraie analyse
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAuditResult: AuditResult = {
      overallScore: 78,
      hdsCompliance: 85,
      scalingoOptimization: 72,
      auditDate: new Date(),
      issues: [
        // CRITIQUES
        {
          id: 'crit-001',
          severity: 'critical',
          category: 'authentication',
          title: 'Session timeout trop long pour données médicales',
          description: 'Les sessions restent actives 24h, risque d\'accès non autorisé',
          impact: 'Accès potentiel aux données médicales par des tiers',
          solution: 'Réduire timeout à 8h et implémenter auto-lock après inactivité',
          implemented: false
        },
        {
          id: 'crit-002',
          severity: 'critical',
          category: 'data-protection',
          title: 'Codes d\'accès institution expiration insuffisante',
          description: 'Codes institution valides 24h, durée excessive pour urgences',
          impact: 'Fenêtre d\'exploitation trop large pour accès malveillant',
          solution: 'Réduire à 4-6h avec renouvellement automatique',
          implemented: false
        },
        
        // ÉLEVÉS
        {
          id: 'high-001',
          severity: 'high',
          category: 'authorization',
          title: 'Politiques RLS incomplètes sur certaines tables',
          description: 'Tables sms_send_logs, security_audit_logs sans RLS complète',
          impact: 'Risque d\'accès transversal aux logs sensibles',
          solution: 'Implémenter RLS strict sur toutes les tables de logs',
          implemented: false
        },
        {
          id: 'high-002',
          severity: 'high',
          category: 'infrastructure',
          title: 'Rate limiting insuffisant sur endpoints critiques',
          description: 'Limitation à 100 req/15min trop permissive pour auth',
          impact: 'Vulnérabilité aux attaques par déni de service',
          solution: 'Implémenter rate limiting adaptatif par endpoint',
          implemented: false,
          scalingoSpecific: true
        },
        
        // MOYENS
        {
          id: 'med-001',
          severity: 'medium',
          category: 'compliance',
          title: 'Logs d\'audit HDS incomplets',
          description: 'Manque traçabilité complète accès données médicales',
          impact: 'Non-conformité potentielle HDS sur audit trail',
          solution: 'Enrichir logs avec contexte médical complet',
          implemented: false,
          scalingoSpecific: true
        },
        {
          id: 'med-002',
          severity: 'medium',
          category: 'code-security',
          title: 'Validation côté client uniquement sur certains champs',
          description: 'Validation dates de naissance non dupliquée côté serveur',
          impact: 'Bypass possible de validations métier',
          solution: 'Dupliquer toutes validations côté serveur',
          implemented: false
        },
        
        // FAIBLES
        {
          id: 'low-001',
          severity: 'low',
          category: 'infrastructure',
          title: 'Headers de sécurité Scalingo optimisables',
          description: 'CSP pourrait être plus restrictive pour l\'environnement HDS',
          impact: 'Protection XSS améliorable',
          solution: 'Optimiser CSP pour Scalingo HDS avec nonces',
          implemented: false,
          scalingoSpecific: true
        }
      ],
      recommendations: [
        '🔒 Implémenter 2FA obligatoire pour comptes institution',
        '📊 Monitoring temps réel des accès aux données médicales',
        '🔄 Rotation automatique des clés de chiffrement',
        '📋 Procédure d\'incident de sécurité documentée',
        '🏥 Certification HDS niveau expert pour hosting',
        '⚡ Optimisation performance Scalingo pour pic de charge',
        '🔍 Audit de code automatisé avec SonarQube',
        '📱 App mobile sécurisée pour accès d\'urgence'
      ]
    };
    
    setAuditResult(mockAuditResult);
    setIsRunning(false);
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Lock className="w-4 h-4" />;
      case 'authorization': return <Shield className="w-4 h-4" />;
      case 'data-protection': return <Database className="w-4 h-4" />;
      case 'infrastructure': return <Server className="w-4 h-4" />;
      case 'code-security': return <Code className="w-4 h-4" />;
      case 'compliance': return <FileText className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const filteredIssues = auditResult?.issues.filter(issue => 
    selectedCategory === 'all' || issue.category === selectedCategory
  ) || [];

  const exportAuditReport = () => {
    if (!auditResult) return;
    
    const reportData = {
      ...auditResult,
      exportedAt: new Date().toISOString(),
      environment: 'Scalingo HDS Production'
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-securite-scalingo-hds-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    runSecurityAudit();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Audit de Sécurité - Scalingo HDS
          </h1>
          <p className="text-gray-600 mt-2">
            Analyse complète de sécurité pour environnement HDS
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={runSecurityAudit} 
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
                Relancer l'Audit
              </>
            )}
          </Button>
          {auditResult && (
            <Button variant="outline" onClick={exportAuditReport}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          )}
        </div>
      </div>

      {/* Scores principaux */}
      {auditResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Score Global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{auditResult.overallScore}%</div>
                <Badge className={`${getScoreBadgeColor(auditResult.overallScore)} text-white`}>
                  {auditResult.overallScore >= 80 ? 'Bon' : auditResult.overallScore >= 60 ? 'Moyen' : 'Critique'}
                </Badge>
              </div>
              <Progress value={auditResult.overallScore} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Conformité HDS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{auditResult.hdsCompliance}%</div>
                <Badge className={`${getScoreBadgeColor(auditResult.hdsCompliance)} text-white`}>
                  HDS
                </Badge>
              </div>
              <Progress value={auditResult.hdsCompliance} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Optimisation Scalingo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{auditResult.scalingoOptimization}%</div>
                <Badge className={`${getScoreBadgeColor(auditResult.scalingoOptimization)} text-white`}>
                  Cloud
                </Badge>
              </div>
              <Progress value={auditResult.scalingoOptimization} className="mt-3" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Onglets détaillés */}
      {auditResult && (
        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="issues">Problèmes Identifiés</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            <TabsTrigger value="scalingo">Spécifique Scalingo</TabsTrigger>
          </TabsList>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Problèmes de Sécurité</CardTitle>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="all">Toutes catégories</option>
                    <option value="authentication">Authentification</option>
                    <option value="authorization">Autorisation</option>
                    <option value="data-protection">Protection données</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="code-security">Sécurité code</option>
                    <option value="compliance">Conformité</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <div key={issue.id} className={`p-4 border rounded-lg ${getSeverityColor(issue.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getSeverityIcon(issue.severity)}
                          <div>
                            <h3 className="font-semibold">{issue.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {getCategoryIcon(issue.category)}
                              <span className="text-sm capitalize">{issue.category.replace('-', ' ')}</span>
                              {issue.scalingoSpecific && (
                                <Badge variant="outline" className="text-xs">Scalingo</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${getSeverityColor(issue.severity)} border-0`}>
                          {issue.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <p className="text-sm"><strong>Description :</strong> {issue.description}</p>
                        <p className="text-sm"><strong>Impact :</strong> {issue.impact}</p>
                        <p className="text-sm"><strong>Solution :</strong> {issue.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations Prioritaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-blue-600 mt-0.5">
                        {rec.includes('🔒') ? '🔒' : 
                         rec.includes('📊') ? '📊' : 
                         rec.includes('🔄') ? '🔄' : 
                         rec.includes('📋') ? '📋' : 
                         rec.includes('🏥') ? '🏥' : 
                         rec.includes('⚡') ? '⚡' : 
                         rec.includes('🔍') ? '🔍' : '📱'}
                      </div>
                      <div className="text-sm text-blue-800">
                        {rec.replace(/^[🔒📊🔄📋🏥⚡🔍📱]\s*/, '')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scalingo">
            <Card>
              <CardHeader>
                <CardTitle>Optimisations Scalingo HDS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Server className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Environnement détecté :</strong> Scalingo HDS
                      <br />
                      Optimisations spécifiques disponibles pour maximiser la sécurité et performance.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-green-600 mb-2">✅ Déjà optimisé</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Hébergement HDS certifié</li>
                        <li>• HTTPS forcé et HSTS</li>
                        <li>• Backup automatique quotidien</li>
                        <li>• Logs centralisés</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-orange-600 mb-2">🔧 À optimiser</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Rate limiting adaptatif</li>
                        <li>• WAF configuration</li>
                        <li>• Monitoring temps réel</li>
                        <li>• Auto-scaling sécurisé</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SecurityAuditDashboard;
