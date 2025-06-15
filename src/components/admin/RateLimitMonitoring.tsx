
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adaptiveRateLimiter } from '@/utils/security/adaptiveRateLimiter';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';

interface EndpointMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestTime: number;
  baseLimit: number;
  currentLimit: number;
  adjustmentFactor: number;
}

const RateLimitMonitoring = () => {
  const [metrics, setMetrics] = useState<Map<string, EndpointMetrics>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshMetrics = () => {
    const currentMetrics = adaptiveRateLimiter.getMetrics() as Map<string, EndpointMetrics>;
    setMetrics(new Map(currentMetrics));
    setLastUpdate(new Date());
  };

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (metrics: EndpointMetrics) => {
    const errorRate = metrics.requestCount > 0 ? metrics.errorCount / metrics.requestCount : 0;
    
    if (errorRate > 0.15) {
      return <Badge variant="destructive">Critique</Badge>;
    } else if (errorRate > 0.05 || metrics.averageResponseTime > 2000) {
      return <Badge variant="secondary">Attention</Badge>;
    } else {
      return <Badge variant="default">Normal</Badge>;
    }
  };

  const getTrendIcon = (adjustmentFactor: number) => {
    if (adjustmentFactor > 1.1) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (adjustmentFactor < 0.9) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rate Limiting Adaptatif</h2>
          <p className="text-gray-600">
            Surveillance en temps réel des limites de taux par endpoint
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button onClick={refreshMetrics} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from(metrics.entries()).map(([endpoint, endpointMetrics]) => {
          const errorRate = endpointMetrics.requestCount > 0 ? 
            (endpointMetrics.errorCount / endpointMetrics.requestCount * 100) : 0;
          const limitUtilization = (endpointMetrics.requestCount / endpointMetrics.currentLimit * 100);

          return (
            <Card key={endpoint} className="h-fit">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">
                      {endpoint}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(endpointMetrics)}
                      {getTrendIcon(endpointMetrics.adjustmentFactor)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Limite Actuelle</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {endpointMetrics.currentLimit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Base: {endpointMetrics.baseLimit} 
                      (×{endpointMetrics.adjustmentFactor.toFixed(2)})
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Requêtes</p>
                    <p className="text-2xl font-bold text-green-600">
                      {endpointMetrics.requestCount}
                    </p>
                    <p className="text-xs text-gray-500">
                      Utilisation: {limitUtilization.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Taux d'Erreur</p>
                    <p className={`text-2xl font-bold ${errorRate > 15 ? 'text-red-600' : errorRate > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {errorRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {endpointMetrics.errorCount} erreurs
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Temps de Réponse</p>
                    <p className={`text-2xl font-bold ${endpointMetrics.averageResponseTime > 2000 ? 'text-red-600' : endpointMetrics.averageResponseTime > 1000 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {endpointMetrics.averageResponseTime.toFixed(0)}ms
                    </p>
                    <p className="text-xs text-gray-500">Moyenne mobile</p>
                  </div>
                </div>

                {endpointMetrics.lastRequestTime > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Dernière requête: {new Date(endpointMetrics.lastRequestTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {metrics.size === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune métrique de rate limiting disponible</p>
            <p className="text-sm text-gray-500 mt-2">
              Les métriques apparaîtront après les premières requêtes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RateLimitMonitoring;
