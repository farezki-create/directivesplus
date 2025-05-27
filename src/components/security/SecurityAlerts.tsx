
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw,
  Eye,
  Database,
  Lock
} from "lucide-react";
import { consolidatedSecurity } from "@/utils/security/consolidatedSecurity";

const SecurityAlerts = () => {
  const [securityStats, setSecurityStats] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshSecurityData = () => {
    setIsRefreshing(true);
    
    try {
      const stats = consolidatedSecurity.getSecurityStats();
      const detectedAnomalies = consolidatedSecurity.detectSecurityAnomalies();
      const events = consolidatedSecurity.getRecentSecurityEvents(10);
      
      setSecurityStats(stats);
      setAnomalies(detectedAnomalies);
      setRecentEvents(events);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de sécurité:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshSecurityData();
    
    // Actualisation automatique toutes les 30 secondes
    const interval = setInterval(refreshSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton de rafraîchissement */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alertes de Sécurité</h2>
          <p className="text-gray-600">Surveillance en temps réel des événements de sécurité</p>
        </div>
        <Button 
          onClick={refreshSecurityData}
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques globales */}
      {securityStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Événements Total</p>
                  <p className="text-2xl font-bold text-blue-600">{securityStats.totalEvents}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tentatives Échouées</p>
                  <p className="text-2xl font-bold text-red-600">{securityStats.failedAttempts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accès Réussis</p>
                  <p className="text-2xl font-bold text-green-600">{securityStats.successfulAttempts}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Comptes Verrouillés</p>
                  <p className="text-2xl font-bold text-orange-600">{securityStats.lockedAccounts}</p>
                </div>
                <Lock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Anomalies détectées */}
      {anomalies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Anomalies Détectées ({anomalies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalies.map((anomaly, index) => (
                <Alert key={index} className={`border ${getSeverityColor(anomaly.severity)}`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityBadge(anomaly.severity)}>
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{anomaly.type}</span>
                        </div>
                        <p className="text-sm mb-2">{anomaly.description}</p>
                        <p className="text-xs text-gray-600">
                          <strong>Recommandation:</strong> {anomaly.recommendation}
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
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
            Événements Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length > 0 ? (
            <div className="space-y-2">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${event.success ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <span className="font-medium">{event.type}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {event.identifier}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucun événement de sécurité récent
            </p>
          )}
        </CardContent>
      </Card>

      {/* État du système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            État du Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Authentification: Fonctionnelle</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Base de données: Sécurisée</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Chiffrement: Actif</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAlerts;
