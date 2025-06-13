
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Server, 
  Database, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Cpu,
  Wifi
} from "lucide-react";

interface SystemMetrics {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  uptime: string;
  activeUsers: number;
  requestsPerMinute: number;
  errorRate: number;
}

const SystemMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    storage: 0,
    network: 0,
    uptime: "0d 0h 0m",
    activeUsers: 0,
    requestsPerMinute: 0,
    errorRate: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMetrics = () => {
      // Simulation des métriques système
      setMetrics({
        cpu: Math.random() * 100,
        memory: 65 + Math.random() * 20,
        storage: 45 + Math.random() * 10,
        network: 80 + Math.random() * 15,
        uptime: "15d 8h 32m",
        activeUsers: Math.floor(150 + Math.random() * 50),
        requestsPerMinute: Math.floor(80 + Math.random() * 40),
        errorRate: Math.random() * 2
      });
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'bg-red-500';
    if (value >= thresholds.warning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Utilisation mémoire élevée détectée',
      time: '14:30',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      message: 'Sauvegarde automatique terminée',
      time: '12:00',
      severity: 'low'
    },
    {
      id: 3,
      type: 'success',
      message: 'Tous les services fonctionnent normalement',
      time: '10:15',
      severity: 'low'
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-2">Chargement des métriques...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec mise à jour */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Surveillance Système</h2>
          <p className="text-gray-600">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Actualiser
        </Button>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              CPU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{metrics.cpu.toFixed(1)}%</div>
            <Progress 
              value={metrics.cpu} 
              className="h-2 mb-2"
              // @ts-ignore
              style={{'--progress-foreground': getProgressColor(metrics.cpu, { warning: 70, critical: 90 })}}
            />
            <p className={`text-xs ${getStatusColor(metrics.cpu, { warning: 70, critical: 90 })}`}>
              {metrics.cpu < 70 ? 'Normal' : metrics.cpu < 90 ? 'Élevé' : 'Critique'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-green-600" />
              Mémoire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{metrics.memory.toFixed(1)}%</div>
            <Progress 
              value={metrics.memory} 
              className="h-2 mb-2"
              // @ts-ignore
              style={{'--progress-foreground': getProgressColor(metrics.memory, { warning: 80, critical: 95 })}}
            />
            <p className={`text-xs ${getStatusColor(metrics.memory, { warning: 80, critical: 95 })}`}>
              {metrics.memory < 80 ? 'Normal' : metrics.memory < 95 ? 'Élevé' : 'Critique'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600" />
              Stockage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{metrics.storage.toFixed(1)}%</div>
            <Progress 
              value={metrics.storage} 
              className="h-2 mb-2"
              // @ts-ignore
              style={{'--progress-foreground': getProgressColor(metrics.storage, { warning: 85, critical: 95 })}}
            />
            <p className={`text-xs ${getStatusColor(metrics.storage, { warning: 85, critical: 95 })}`}>
              {metrics.storage < 85 ? 'Normal' : metrics.storage < 95 ? 'Élevé' : 'Critique'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="w-4 h-4 text-orange-600" />
              Réseau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{metrics.network.toFixed(1)}%</div>
            <Progress 
              value={metrics.network} 
              className="h-2 mb-2"
              // @ts-ignore
              style={{'--progress-foreground': getProgressColor(metrics.network, { warning: 90, critical: 98 })}}
            />
            <p className={`text-xs ${getStatusColor(metrics.network, { warning: 90, critical: 98 })}`}>
              {metrics.network < 90 ? 'Normal' : metrics.network < 98 ? 'Élevé' : 'Critique'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Statistiques en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Utilisateurs actifs</span>
                </div>
                <span className="font-bold">{metrics.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Requêtes/minute</span>
                </div>
                <span className="font-bold">{metrics.requestsPerMinute}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm">Taux d'erreur</span>
                </div>
                <span className="font-bold">{metrics.errorRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Temps de fonctionnement</span>
                </div>
                <span className="font-bold">{metrics.uptime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertes Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
                  {alert.type === 'info' && <Activity className="w-4 h-4 text-blue-600 mt-0.5" />}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{alert.message}</div>
                    <div className="text-xs text-gray-600">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statut des services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Statut des Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'API Principal', status: 'operational', response: '125ms' },
              { name: 'Base de données', status: 'operational', response: '45ms' },
              { name: 'Authentification', status: 'operational', response: '89ms' },
              { name: 'Stockage', status: 'operational', response: '67ms' },
              { name: 'Email', status: 'operational', response: '234ms' },
              { name: 'SMS', status: 'degraded', response: '456ms' },
              { name: 'Monitoring', status: 'operational', response: '23ms' },
              { name: 'Backup', status: 'operational', response: '78ms' }
            ].map((service) => (
              <div key={service.name} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{service.name}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'operational' ? 'bg-green-500' : 
                    service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
                <div className="text-xs text-gray-600">{service.response}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoringDashboard;
