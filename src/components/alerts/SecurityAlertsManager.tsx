
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, CheckCircle, Clock, Eye } from 'lucide-react';
import { securityMonitor, SecurityAlert } from '@/utils/security/securityMonitor';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const SecurityAlertsManager = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Démarrer le monitoring de sécurité
    securityMonitor.startMonitoring();
    
    // Charger les alertes initiales
    const loadAlerts = () => {
      const allAlerts = securityMonitor.getAllAlerts();
      setAlerts(allAlerts);
      setLoading(false);
    };

    loadAlerts();

    // Actualiser les alertes toutes les 30 secondes
    const interval = setInterval(loadAlerts, 30000);

    return () => {
      clearInterval(interval);
      securityMonitor.stopMonitoring();
    };
  }, []);

  const handleResolveAlert = (alertId: string) => {
    securityMonitor.resolveAlert(alertId);
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'default',
      medium: 'secondary',
      high: 'destructive',
      critical: 'destructive'
    } as const;

    const colors = {
      low: 'text-blue-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    } as const;

    return (
      <Badge variant={variants[severity as keyof typeof variants] || 'default'}>
        <AlertTriangle className={`w-3 h-3 mr-1 ${colors[severity as keyof typeof colors]}`} />
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des alertes de sécurité...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertes actives */}
      {activeAlerts.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Shield className="w-5 h-5" />
              Alertes de Sécurité Actives ({activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-red-800">{alert.message}</h4>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-red-600 mb-2">Type: {alert.type}</p>
                      <span className="text-xs text-red-500">
                        {formatDistanceToNow(alert.timestamp, { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {alert.recommendations.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium text-red-700 mb-1">Recommandations:</h5>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {alert.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Résoudre
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertes résolues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historique des Alertes de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resolvedAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune alerte résolue</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resolvedAlerts.slice(0, 10).map((alert) => (
                <div key={alert.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{alert.message}</span>
                        {getSeverityBadge(alert.severity)}
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Résolue
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Type: {alert.type}</p>
                      <span className="text-xs text-gray-500">
                        Résolue {formatDistanceToNow(alert.timestamp, { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statut global */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Monitoring de Sécurité Actif</strong>
          <br />
          Le système surveille en continu les menaces de sécurité et génère des alertes automatiquement.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SecurityAlertsManager;
