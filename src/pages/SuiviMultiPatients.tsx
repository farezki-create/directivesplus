
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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

  const getSeverityBadge = (value: number, type: "douleur" | "dyspnee" | "anxiete") => {
    let color = "bg-gray-100 text-gray-800";
    let label = "Aucun";

    if (value > 0 && value <= 3) {
      color = "bg-green-100 text-green-800";
      label = "Léger";
    } else if (value > 3 && value <= 6) {
      color = "bg-yellow-100 text-yellow-800";
      label = "Modéré";
    } else if (value > 6) {
      color = "bg-red-100 text-red-800";
      label = "Sévère";
    }

    const typeLabels = {
      douleur: "Douleur",
      dyspnee: "Dyspnée",
      anxiete: "Anxiété"
    };

    return (
      <Badge className={color}>
        {typeLabels[type]}: {value}/10 ({label})
      </Badge>
    );
  };

  const isCriticalSymptom = (symptom: SymptomEntry) => {
    return symptom.douleur >= 8 || symptom.dyspnee >= 7 || symptom.anxiete >= 8;
  };

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

          {/* Sélecteur de patient */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Sélection du Patient
              </CardTitle>
              <CardDescription>
                Choisissez un patient pour consulter son historique de symptômes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedPatient?.id || ""}
                onValueChange={(value) => {
                  const patient = patients.find(p => p.id === value);
                  setSelectedPatient(patient || null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Sélectionner un patient --" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.prenom} {patient.nom} ({patient.date_naissance})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Affichage des symptômes */}
          {selectedPatient && (
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
                      <div
                        key={symptom.id}
                        className={`border rounded-lg p-4 ${
                          isCriticalSymptom(symptom) 
                            ? 'border-red-200 bg-red-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {formatDistanceToNow(new Date(symptom.created_at), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            {isCriticalSymptom(symptom) && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Critique
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              {symptom.auteur}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {getSeverityBadge(symptom.douleur, "douleur")}
                          {getSeverityBadge(symptom.dyspnee, "dyspnee")}
                          {getSeverityBadge(symptom.anxiete, "anxiete")}
                        </div>

                        {symptom.remarque && (
                          <div className="bg-gray-50 rounded p-3 text-sm">
                            <strong>Remarques:</strong> {symptom.remarque}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
