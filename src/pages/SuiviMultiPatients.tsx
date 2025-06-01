import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppNavigation from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PatientSelector from "@/components/symptom-tracker/PatientSelector";
import PatientSymptomsDashboard from "@/components/symptom-tracker/PatientSymptomsDashboard";

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

const SuiviMultiPatients = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/suivi-multi-patients" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Vérifier si l'utilisateur est un soignant
  const isSoignant = user?.email?.endsWith('@directivesplus.fr');

  const fetchPatients = async () => {
    try {
      // Pour l'instant, on récupère les utilisateurs avec des profils complets depuis la table profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, birth_date, created_at")
        .not("first_name", "is", null)
        .not("last_name", "is", null)
        .not("birth_date", "is", null);

      if (error) {
        console.error("Erreur lors du chargement des patients:", error);
        setError("Erreur lors du chargement des patients");
      } else {
        // Transformer les données pour correspondre à notre interface Patient
        const transformedPatients: Patient[] = (data || []).map(profile => ({
          id: profile.id,
          nom: profile.last_name || '',
          prenom: profile.first_name || '',
          date_naissance: profile.birth_date || '',
          created_at: profile.created_at || ''
        }));
        setPatients(transformedPatients);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur inattendue");
    }
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

  useEffect(() => {
    if (isSoignant) {
      fetchPatients();
    }
  }, [isSoignant]);

  useEffect(() => {
    if (selectedPatient) {
      fetchSymptoms(selectedPatient.id);
    }
  }, [selectedPatient]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isSoignant) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour au tableau de bord
            </Button>
          </div>
          
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Accès Restreint
            </h1>
            <p className="text-gray-600">
              Cette page est réservée au personnel soignant. 
              Vous devez avoir un compte avec une adresse email @directivesplus.fr pour y accéder.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour au tableau de bord
          </Button>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
              Suivi Multi-Patients
            </h1>
            <p className="text-gray-600 text-lg">
              Surveillez et analysez les symptômes de tous vos patients
            </p>
          </div>

          {/* Sélecteur de patient avec alertes */}
          <PatientSelector 
            patients={patients}
            selectedPatient={selectedPatient}
            onPatientSelect={setSelectedPatient}
            symptoms={symptoms}
          />

          {/* Affichage des symptômes avec alertes critiques */}
          {selectedPatient && (
            <PatientSymptomsDashboard
              selectedPatient={selectedPatient}
              symptoms={symptoms}
              loading={loading}
              error={error}
            />
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

export default SuiviMultiPatients;
