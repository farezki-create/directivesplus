
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, AlertTriangle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SymptomEvolutionChart from "./SymptomEvolutionChart";
import SymptomHistoryCard from "./SymptomHistoryCard";
import CriticalSymptomAlert from "./CriticalSymptomAlert";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
}

interface SymptomEntry {
  id: string;
  douleur: number;
  dyspnee: number;
  anxiete: number;
  fatigue: number;
  sommeil: number;
  remarque: string | null;
  auteur: string;
  created_at: string;
  patient_id: string;
}

interface SharedSymptomDashboardProps {
  patient: Patient;
  symptoms: SymptomEntry[];
  loading: boolean;
  error: string | null;
}

export default function SharedSymptomDashboard({ 
  patient, 
  symptoms, 
  loading, 
  error 
}: SharedSymptomDashboardProps) {
  
  const getLatestCriticalStatus = () => {
    if (symptoms.length === 0) return null;
    const latestSymptom = symptoms[0]; // Les symptômes sont triés par date DESC
    return {
      douleur: latestSymptom.douleur,
      dyspnee: latestSymptom.dyspnee,
      anxiete: latestSymptom.anxiete,
      isCritical: latestSymptom.douleur >= 8 || latestSymptom.dyspnee >= 7 || latestSymptom.anxiete >= 8
    };
  };

  const criticalStatus = getLatestCriticalStatus();

  return (
    <>
      {/* Informations patient */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">
                Patient : {patient.first_name} {patient.last_name}
              </h3>
              <p className="text-blue-600 text-sm">
                Né(e) le {new Date(patient.birth_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                Accès externe
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerte critique si nécessaire */}
      {criticalStatus?.isCritical && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">
                  🔥 État critique détecté
                </h3>
                <CriticalSymptomAlert 
                  douleur={criticalStatus.douleur}
                  dyspnee={criticalStatus.dyspnee}
                  anxiete={criticalStatus.anxiete}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Graphique d'évolution */}
      <SymptomEvolutionChart 
        symptoms={symptoms} 
        className="mb-6"
      />

      {/* Historique des symptômes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des Symptômes
            {criticalStatus?.isCritical && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                🔥 Critique
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Suivi chronologique des évaluations de symptômes
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-directiveplus-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement des symptômes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Erreur: {error}
            </div>
          ) : symptoms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune évaluation de symptômes enregistrée pour ce patient
            </div>
          ) : (
            <div className="space-y-4">
              {symptoms.map((symptom) => (
                <SymptomHistoryCard key={symptom.id} symptom={symptom} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
