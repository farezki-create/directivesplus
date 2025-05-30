
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Activity, Eye, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSecureAuth } from "@/hooks/useSecureAuth";

interface SecurityAlert {
  id: string;
  event_type: string;
  user_id?: string;
  ip_address?: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  details?: any;
  count?: number;
}

const SecurityAlerts: React.FC = () => {
  const { isAdmin } = useSecureAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    criticalEvents: 0,
    recentEvents: 0,
    activeThreats: 0
  });

  useEffect(() => {
    if (!isAdmin) return;

    const loadSecurityAlerts = async () => {
      try {
        // Get recent high-risk security events
        const { data: alertsData, error } = await supabase
          .from('security_audit_logs')
          .select('*')
          .in('risk_level', ['high', 'critical'])
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error loading security alerts:', error);
          return;
        }

        const transformedAlerts: SecurityAlert[] = (alertsData || []).map(event => ({
          id: event.id,
          event_type: event.event_type,
          user_id: event.user_id || undefined,
          ip_address: event.ip_address ? String(event.ip_address) : undefined,
          risk_level: event.risk_level as 'low' | 'medium' | 'high' | 'critical',
          created_at: event.created_at,
          details: event.details
        }));

        setAlerts(transformedAlerts);

        // Calculate security statistics
        const { data: statsData, error: statsError } = await supabase
          .from('security_audit_logs')
          .select('risk_level, created_at')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        if (!statsError && statsData) {
          const totalEvents = statsData.length;
          const criticalEvents = statsData.filter(e => e.risk_level === 'critical').length;
          const recentEvents = statsData.filter(e => {
            const eventTime = new Date(e.created_at);
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return eventTime > oneHourAgo;
          }).length;

          // Check for active threats (multiple high-risk events from same IP)
          const ipCounts = {};
          alertsData?.forEach(event => {
            if (event.ip_address && event.risk_level === 'high') {
              ipCounts[event.ip_address] = (ipCounts[event.ip_address] || 0) + 1;
            }
          });
          const activeThreats = Object.values(ipCounts).filter(count => count > 3).length;

          setStats({
            totalEvents,
            criticalEvents,
            recentEvents,
            activeThreats
          });
        }

      } catch (error) {
        console.error('Error in loadSecurityAlerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSecurityAlerts();

    // Set up real-time subscription for new alerts
    const channel = supabase
      .channel('security-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_audit_logs',
          filter: 'risk_level=in.(high,critical)'
        },
        (payload) => {
          const newAlert: SecurityAlert = {
            id: payload.new.id,
            event_type: payload.new.event_type,
            user_id: payload.new.user_id || undefined,
            ip_address: payload.new.ip_address ? String(payload.new.ip_address) : undefined,
            risk_level: payload.new.risk_level as 'low' | 'medium' | 'high' | 'critical',
            created_at: payload.new.created_at,
            details: payload.new.details
          };
          
          setAlerts(prev => [newAlert, ...prev.slice(0, 19)]);
          
          // Update stats
          setStats(prev => ({
            ...prev,
            totalEvents: prev.totalEvents + 1,
            criticalEvents: prev.criticalEvents + (newAlert.risk_level === 'critical' ? 1 : 0),
            recentEvents: prev.recentEvents + 1
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Accès restreint aux administrateurs uniquement.
        </AlertDescription>
      </Alert>
    );
  }

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Alertes de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements 24h</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalEvents}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dernière Heure</p>
                <p className="text-2xl font-bold text-orange-600">{stats.recentEvents}</p>
              </div>
              <Eye className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menaces Actives</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeThreats}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Alertes de Sécurité Critiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-gray-500">Aucune alerte critique récente</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.risk_level === 'critical' 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getRiskIcon(alert.risk_level)}
                        <span className="font-medium">{formatEventType(alert.event_type)}</span>
                        <Badge variant={getRiskBadgeVariant(alert.risk_level)}>
                          {alert.risk_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {new Date(alert.created_at).toLocaleString('fr-FR')}
                      </p>
                      {alert.ip_address && (
                        <p className="text-xs text-gray-500">IP: {alert.ip_address}</p>
                      )}
                      {alert.details && (
                        <div className="mt-2 p-2 bg-white rounded text-xs">
                          <strong>Détails:</strong>
                          <pre className="mt-1 whitespace-pre-wrap">
                            {JSON.stringify(alert.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAlerts;
