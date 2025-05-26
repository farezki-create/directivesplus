
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  Activity,
  RefreshCw,
  XCircle,
  CheckCircle
} from "lucide-react";
import { consolidatedSecurity } from "@/utils/security/consolidatedSecurity";
import { securityMonitor } from "@/utils/security/securityMonitor";

const SecurityAlerts = () => {
  const [securityReport, setSecurityReport] = useState<any>(null);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshSecurityData = async () => {
    setIsRefreshing(true);
    try {
      // Obtenir le rapport de sécurité consolidé
      const report = consolidatedSecurity.generateSecurityReport();
      setSecurityReport(report);

      // Obtenir les alertes actives du monitoring
      const alerts = securityMonitor.getActiveAlerts();
      setActiveAlerts(alerts);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données de sécurité:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshSecurityData();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(refreshSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <Activity className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const resolveAlert = (alertId: string) => {
    securityMonitor.resolveAlert(alertId);
    refreshSecurityData();
  };

  if (!securityReport) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          Chargement des données de sécurité...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résumé rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              État de Sécurité en Temps Réel
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshSecurityData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {securityReport.summary.successfulAttempts}
              </div>
              <div className="text-sm text-gray-600">Connexions Réussies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {securityReport.summary.failedAttempts}
              </div>
              <div className="text-sm text-gray-600">Tentatives Échouées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {securityReport.summary.lockedAccounts}
              </div>
              <div className="text-sm text-gray-600">Comptes Verrouillés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {activeAlerts.length}
              </div>
              <div className="text-sm text-gray-600">Alertes Actives</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes actives */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertes de Sécurité Actives ({activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <Alert key={alert.id} variant="destructive">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <AlertDescription>
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-sm opacity-90 mt-1">
                            Source: {alert.source} • {alert.timestamp.toLocaleString()}
                          </div>
                        </AlertDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Résoudre
                      </Button>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Anomalies détectées */}
      {securityReport.anomalies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Anomalies Détectées ({securityReport.anomalies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityReport.anomalies.map((anomaly, index) => (
                <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-orange-900">{anomaly.description}</div>
                      <div className="text-sm text-orange-700 mt-1">
                        Recommandation: {anomaly.recommendation}
                      </div>
                    </div>
                    <Badge className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Événements récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Événements de Sécurité Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {securityReport.recentEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <div className="flex items-center gap-3">
                  {event.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium text-sm">
                      {event.type.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-600">
                      {event.identifier}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {event.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      {securityReport.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Recommandations de Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityReport.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 mt-0.5">💡</div>
                  <div className="text-sm text-blue-800">{recommendation}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* État positif */}
      {activeAlerts.length === 0 && securityReport.anomalies.length === 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium text-green-800">
              ✅ Aucune alerte de sécurité active détectée
            </div>
            <div className="text-sm text-green-700 mt-1">
              Tous les systèmes de sécurité fonctionnent normalement.
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SecurityAlerts;
