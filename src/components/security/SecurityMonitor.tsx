
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Activity, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSecureAuth } from "@/hooks/useSecureAuth";

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id?: string;
  ip_address?: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  details?: any;
}

const SecurityMonitor: React.FC = () => {
  const { isAdmin } = useSecureAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    highRiskEvents: 0,
    recentEvents: 0
  });

  useEffect(() => {
    if (!isAdmin) return;

    const loadSecurityEvents = async () => {
      try {
        const { data: eventsData, error } = await supabase
          .from('security_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error loading security events:', error);
          return;
        }

        // Transform the data to match our interface
        const transformedEvents: SecurityEvent[] = (eventsData || []).map(event => ({
          id: event.id,
          event_type: event.event_type,
          user_id: event.user_id || undefined,
          ip_address: event.ip_address ? String(event.ip_address) : undefined,
          risk_level: event.risk_level as 'low' | 'medium' | 'high' | 'critical',
          created_at: event.created_at,
          details: event.details
        }));

        setEvents(transformedEvents);

        // Calculate stats
        const totalEvents = transformedEvents.length;
        const highRiskEvents = transformedEvents.filter(e => 
          e.risk_level === 'high' || e.risk_level === 'critical'
        ).length;
        const recentEvents = transformedEvents.filter(e => {
          const eventTime = new Date(e.created_at);
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          return eventTime > oneHourAgo;
        }).length;

        setStats({
          totalEvents,
          highRiskEvents,
          recentEvents
        });

      } catch (error) {
        console.error('Error in loadSecurityEvents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSecurityEvents();

    // Set up real-time subscription
    const channel = supabase
      .channel('security-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_audit_logs'
        },
        (payload) => {
          const newEvent: SecurityEvent = {
            id: payload.new.id,
            event_type: payload.new.event_type,
            user_id: payload.new.user_id || undefined,
            ip_address: payload.new.ip_address ? String(payload.new.ip_address) : undefined,
            risk_level: payload.new.risk_level as 'low' | 'medium' | 'high' | 'critical',
            created_at: payload.new.created_at,
            details: payload.new.details
          };
          
          setEvents(prev => [newEvent, ...prev.slice(0, 49)]);
          setStats(prev => ({
            ...prev,
            totalEvents: prev.totalEvents + 1,
            highRiskEvents: prev.highRiskEvents + 
              (['high', 'critical'].includes(newEvent.risk_level) ? 1 : 0),
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

  const formatEventType = (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Monitoring de Sécurité
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements Total</p>
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
                <p className="text-sm font-medium text-gray-600">Risque Élevé</p>
                <p className="text-2xl font-bold text-red-600">{stats.highRiskEvents}</p>
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
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Événements de Sécurité Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun événement enregistré</p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{formatEventType(event.event_type)}</span>
                      <Badge variant={getRiskBadgeVariant(event.risk_level)}>
                        {event.risk_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(event.created_at).toLocaleString('fr-FR')}
                    </p>
                    {event.ip_address && (
                      <p className="text-xs text-gray-500">IP: {event.ip_address}</p>
                    )}
                  </div>
                  {event.details && (
                    <div className="text-xs text-gray-500 max-w-xs">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;
