
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SymptomEntry {
  id: string;
  created_at: string;
  douleur: number;
  dyspnee: number;
  anxiete: number;
  remarque: string | null;
}

const SymptomHistory = () => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("symptom_tracking")
          .select("id, created_at, douleur, dyspnee, anxiete, remarque")
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        setSymptoms(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des symptômes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des symptômes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = symptoms.reverse().map(entry => ({
    date: format(new Date(entry.created_at), "dd/MM", { locale: fr }),
    douleur: entry.douleur,
    dyspnee: entry.dyspnee,
    anxiete: entry.anxiete
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Évolution des symptômes</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="douleur" stroke="#ef4444" name="Douleur" />
                <Line type="monotone" dataKey="dyspnee" stroke="#3b82f6" name="Dyspnée" />
                <Line type="monotone" dataKey="anxiete" stroke="#f59e0b" name="Anxiété" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dernières entrées</CardTitle>
        </CardHeader>
        <CardContent>
          {symptoms.length > 0 ? (
            <div className="space-y-4">
              {symptoms.slice(0, 5).map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">
                      {format(new Date(entry.created_at), "dd MMM yyyy à HH:mm", { locale: fr })}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span>Douleur: {entry.douleur}/10</span>
                    <span>Dyspnée: {entry.dyspnee}/10</span>
                    <span>Anxiété: {entry.anxiete}/10</span>
                  </div>
                  {entry.remarque && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      "{entry.remarque}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">Aucun symptôme enregistré</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomHistory;
