
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SymptomEntry {
  id: string;
  douleur: number;
  dyspnee: number;
  anxiete: number;
  remarque: string | null;
  auteur: string;
  created_at: string;
}

interface SymptomEvolutionChartProps {
  symptoms: SymptomEntry[];
  className?: string;
}

export default function SymptomEvolutionChart({ symptoms, className }: SymptomEvolutionChartProps) {
  // Transformer les données pour le graphique
  const chartData = symptoms
    .slice()
    .reverse() // Inverser pour avoir l'ordre chronologique
    .map((symptom) => ({
      date: format(new Date(symptom.created_at), "dd/MM HH:mm", { locale: fr }),
      fullDate: format(new Date(symptom.created_at), "dd/MM/yyyy HH:mm", { locale: fr }),
      douleur: symptom.douleur,
      dyspnee: symptom.dyspnee,
      anxiete: symptom.anxiete,
    }));

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}/10
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des Symptômes
          </CardTitle>
          <CardDescription>
            Graphique d'évolution de la douleur, dyspnée et anxiété dans le temps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Aucune donnée disponible pour afficher le graphique
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Évolution des Symptômes
        </CardTitle>
        <CardDescription>
          Graphique d'évolution de la douleur, dyspnée et anxiété dans le temps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={[0, 10]}
                stroke="#666"
                fontSize={12}
                label={{ value: 'Intensité (0-10)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="douleur"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Douleur"
              />
              <Line
                type="monotone"
                dataKey="dyspnee"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Dyspnée"
              />
              <Line
                type="monotone"
                dataKey="anxiete"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Anxiété"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Légende des seuils critiques */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Seuils d'alerte :</p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              Douleur critique : ≥ 8/10
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              Dyspnée sévère : ≥ 7/10
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              Anxiété critique : ≥ 8/10
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
