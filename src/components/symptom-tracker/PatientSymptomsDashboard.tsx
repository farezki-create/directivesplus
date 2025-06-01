
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import SymptomEvolutionChart from "./SymptomEvolutionChart";
import SymptomHistoryCard from "./SymptomHistoryCard";

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
  return (
    <>
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
