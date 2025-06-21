
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SymptomEvolutionChart from "./SymptomEvolutionChart";
import SymptomHistoryCard from "./SymptomHistoryCard";
import CriticalSymptomAlert from "./CriticalSymptomAlert";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  created_at: string;
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

interface PatientSymptomsDashboardProps {
  selectedPatient: Patient;
  symptoms: SymptomEntry[];
  loading: boolean;
  error: string | null;
}

export default function PatientSymptomsDashboard({ 
  selectedPatient, 
  symptoms, 
  loading, 
  error 
}: PatientSymptomsDashboardProps) {
  
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
      {/* Alerte critique pour le patient */}
      {criticalStatus?.isCritical && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">
                  🔥 Patient {selectedPatient.prenom} {selectedPatient.nom} - État critique
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

      {/* Historique détaillé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des Symptômes - {selectedPatient.prenom} {selectedPatient.nom}
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
