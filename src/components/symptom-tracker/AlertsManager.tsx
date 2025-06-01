
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Alert {
  id: string;
  patient_id: string;
  type_alerte: string;
  details: string;
  notifie_a: string[];
  date_declenchement: string;
  statut: 'active' | 'acquittee' | 'resolue';
  acquittee_par?: string;
  acquittee_le?: string;
}

export default function AlertsManager() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("alertes")
        .select("*")
        .order("date_declenchement", { ascending: false })
        .limit(50);

      if (fetchError) {
        console.error("Erreur lors du chargement des alertes:", fetchError);
        setError("Erreur lors du chargement des alertes");
      } else {
        setAlerts(data || []);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const updateAlertStatus = async (alertId: string, newStatus: 'acquittee' | 'resolue') => {
    try {
      const { error } = await supabase
        .from("alertes")
        .update({
          statut: newStatus,
          acquittee_par: newStatus === 'acquittee' ? 'soignant' : 'système',
          acquittee_le: new Date().toISOString()
        })
        .eq("id", alertId);

      if (error) {
        console.error("Erreur lors de la mise à jour:", error);
        return;
      }

      // Mettre à jour la liste locale
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, statut: newStatus, acquittee_par: 'soignant', acquittee_le: new Date().toISOString() }
          : alert
      ));
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'active':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Active
        </Badge>;
      case 'acquittee':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Acquittée
        </Badge>;
      case 'resolue':
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Résolue
        </Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Chargement des alertes...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">Erreur: {error}</div>
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = alerts.filter(alert => alert.statut === 'active');
  const otherAlerts = alerts.filter(alert => alert.statut !== 'active');

  return (
    <div className="space-y-6">
      {/* Alertes actives */}
      {activeAlerts.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Alertes Actives ({activeAlerts.length})
            </CardTitle>
            <CardDescription>
              Alertes nécessitant une attention immédiate
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-red-800">{alert.type_alerte}</h4>
                      <p className="text-sm text-red-600 mt-1">{alert.details}</p>
                    </div>
                    {getStatusBadge(alert.statut)}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-red-500">
                      {formatDistanceToNow(new Date(alert.date_declenchement), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </span>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAlertStatus(alert.id, 'acquittee')}
                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        Acquitter
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateAlertStatus(alert.id, 'resolue')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Résoudre
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique des alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historique des Alertes
          </CardTitle>
          <CardDescription>
            Alertes traitées et résolues
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {otherAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune alerte dans l'historique
            </div>
          ) : (
            <div className="space-y-3">
              {otherAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{alert.type_alerte}</span>
                        {getStatusBadge(alert.statut)}
                      </div>
                      <p className="text-sm text-gray-600">{alert.details}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Déclenchée {formatDistanceToNow(new Date(alert.date_declenchement), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                        {alert.acquittee_le && (
                          <span className="text-xs text-gray-500">
                            Traitée {formatDistanceToNow(new Date(alert.acquittee_le), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
