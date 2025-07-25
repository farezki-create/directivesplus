
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMultiPatientData } from "@/hooks/useMultiPatientData";
import AccessRestrictedView from "@/components/multi-patient/AccessRestrictedView";
import MultiPatientContent from "@/components/multi-patient/MultiPatientContent";

const SuiviMultiPatients = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    patients,
    selectedPatient,
    setSelectedPatient,
    symptoms,
    loading,
    error,
    fetchPatients,
    fetchSymptoms
  } = useMultiPatientData();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/suivi-multi-patients" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Vérifier si l'utilisateur est un soignant
  const isSoignant = user?.email?.endsWith('@directivesplus.fr');

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

  const handleBackClick = () => navigate("/dashboard");

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
    return <AccessRestrictedView onBackClick={handleBackClick} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour au tableau de bord
          </Button>
        </div>
        
        <MultiPatientContent
          patients={patients}
          selectedPatient={selectedPatient}
          symptoms={symptoms}
          loading={loading}
          error={error}
          onPatientSelect={setSelectedPatient}
        />
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
