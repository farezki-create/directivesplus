
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SharedSymptomAccessForm from "@/components/symptom-tracker/SharedSymptomAccessForm";
import SharedSymptomDashboard from "@/components/symptom-tracker/SharedSymptomDashboard";

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
  remarque: string | null;
  auteur: string;
  created_at: string;
  patient_id: string;
}

const PartageSymptomes = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);

  const shareCode = searchParams.get("s");

  const handleAccessGranted = async (patientData: Patient) => {
    setPatient(patientData);
    setAccessGranted(true);
    await fetchSymptoms(patientData.id);
  };

  const fetchSymptoms = async (patientId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("symptom_tracking")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des symptômes:", error);
        setError("Erreur lors du chargement des symptômes");
      } else {
        setSymptoms(data || []);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  if (!shareCode) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour à l'accueil
            </Button>
          </div>
          
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Code d'accès manquant</CardTitle>
                <CardDescription>
                  Aucun code d'accès fourni dans l'URL. Vérifiez le lien partagé.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Button>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
              Accès Partagé au Suivi de Symptômes
            </h1>
            <p className="text-gray-600 text-lg">
              Accès sécurisé pour les professionnels de santé externes
            </p>
          </div>

          {!accessGranted ? (
            <SharedSymptomAccessForm 
              shareCode={shareCode}
              onAccessGranted={handleAccessGranted}
            />
          ) : (
            patient && (
              <SharedSymptomDashboard
                patient={patient}
                symptoms={symptoms}
                loading={loading}
                error={error}
              />
            )
          )}
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default PartageSymptomes;
