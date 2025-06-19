
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Database,
  Lock,
  Eye
} from "lucide-react";
import { StrictRLSManager } from "@/utils/security/strictRLSManager";
import { EnhancedSecurityEventLogger } from "@/utils/security/enhancedSecurityEventLogger";
import { useAuth } from "@/contexts/AuthContext";

interface SecurityMetrics {
  totalSecurityEvents: number;
  criticalEvents: number;
  highRiskEvents: number;
  recentAttempts: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

const SecurityMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<Date | null>(null);
  const { user, isAdmin } = useAuth();

  const loadSecurityMetrics = async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      // Charger les métriques de sécurité
      const securityLogs = await StrictRLSManager.getSecurityAuditLogs();
      const accessCodeAttempts = await StrictRLSManager.getAccessCodeAttempts();
      
      // Calculer les métriques
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentEvents = securityLogs.filter(log => 
        new Date(log.created_at) > last24Hours
      );
      
      const criticalEvents = recentEvents.filter(log => 
        log.risk_level === 'critical'
      ).length;
      
      const highRiskEvents = recentEvents.filter(log => 
        log.risk_level === 'high'
      ).length;
      
      const recentAttempts = accessCodeAttempts.filter(attempt => 
        new Date(attempt.attempt_time) > last24Hours && !attempt.success
      ).length;
      
      // Déterminer l'état de santé du système
      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (criticalEvents > 0 || recentAttempts > 50) {
        systemHealth = 'critical';
      } else if (highRiskEvents > 5 || recentAttempts > 20) {
        systemHealth = 'warning';
      }
      
      setMetrics({
        totalSecurityEvents: recentEvents.length,
        criticalEvents,
        highRiskEvents,
        recentAttempts,
        systemHealth
      });
      
      // Logger l'accès au tableau de bord
      await EnhancedSecurityEventLogger.logSecurityAudit(
        'security_dashboard_access',
        user?.id,
        { dashboard_type: 'security_monitoring' }
      );
      
    } catch (error) {
      console.error('Error loading security metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanupLogs = async () => {
    if (!isAdmin) return;
    
    try {
      setIsLoading(true);
      await StrictRLSManager.cleanupOldLogs();
      setLastCleanup(new Date());
      
      await EnhancedSecurityEventLogger.logAdminAction(
        'manual_logs_cleanup',
        user?.id,
        'security_logs',
        { cleanup_time: new Date().toISOString() }
      );
      
      // Recharger les métriques après le nettoyage
      await loadSecurityMetrics();
      
    } catch (error) {
      console.error('Error cleaning up logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadSecurityMetrics();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Accès réservé aux administrateurs</p>
        </CardContent>
      </Card>
    );
  }

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSystemHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <XCircle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Monitoring de Sécurité
          </h1>
          <p className="text-gray-600 mt-2">
            Surveillance en temps réel des événements de sécurité
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadSecurityMetrics} disabled={isLoading}>
            <Eye className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={handleCleanupLogs} disabled={isLoading}>
            <Database className="w-4 h-4 mr-2" />
            Nettoyer les Logs
          </Button>
        </div>
      </div>

      {/* État de santé du système */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getSystemHealthIcon(metrics.systemHealth)}
              État de Santé du Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className={getSystemHealthColor(metrics.systemHealth)}>
                {metrics.systemHealth === 'healthy' && 'Système Sain'}
                {metrics.systemHealth === 'warning' && 'Attention Requise'}
                {metrics.systemHealth === 'critical' && 'Intervention Critique'}
              </Badge>
              <div className="text-sm text-gray-600">
                Dernière vérification: {new Date().toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métriques de sécurité */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Événements (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSecurityEvents}</div>
              <p className="text-xs text-gray-500">Total des événements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                Événements Critiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.criticalEvents}</div>
              <p className="text-xs text-gray-500">Risque critique</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                Risque Élevé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metrics.highRiskEvents}</div>
              <p className="text-xs text-gray-500">Événements à surveiller</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Tentatives Échouées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.recentAttempts}</div>
              <p className="text-xs text-gray-500">Codes d'accès (24h)</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alertes de sécurité */}
      {metrics && metrics.systemHealth !== 'healthy' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">Actions Recommandées :</div>
              {metrics.criticalEvents > 0 && (
                <div className="text-sm">• Examiner immédiatement les {metrics.criticalEvents} événements critiques</div>
              )}
              {metrics.recentAttempts > 50 && (
                <div className="text-sm">• Potentielle attaque par force brute détectée ({metrics.recentAttempts} tentatives)</div>
              )}
              {metrics.highRiskEvents > 5 && (
                <div className="text-sm">• Analyser les {metrics.highRiskEvents} événements à risque élevé</div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Information sur le dernier nettoyage */}
      {lastCleanup && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">
                Nettoyage des logs effectué avec succès à {lastCleanup.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityMonitoringDashboard;
