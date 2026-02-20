
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import SymptomTracker from "@/components/symptom-tracker/SymptomTracker";
import SymptomHistory from "@/components/symptom-tracker/SymptomHistory";
import SymptomEvolutionChart from "@/components/symptom-tracker/SymptomEvolutionChart";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSymptomHistory } from "@/hooks/useSymptomHistory";
import MedicalDeviceDisclaimer from "@/components/symptom-tracker/MedicalDeviceDisclaimer";

const SuiviPalliatif = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { symptoms } = useSymptomHistory();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/suivi-palliatif" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

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
          {/* Disclaimer réglementaire */}
          <MedicalDeviceDisclaimer />

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
              Suivi en soins palliatifs
            </h1>
            <p className="text-gray-600 text-lg">
              Évaluez et suivez l'évolution de votre ressenti dans le cadre de vos soins palliatifs
            </p>
          </div>

          {/* Composant de saisie des symptômes */}
          <div>
            <SymptomTracker />
          </div>

          {/* Graphique d'évolution des symptômes */}
          <div>
            <SymptomEvolutionChart symptoms={symptoms} />
          </div>

          {/* Historique des symptômes */}
          <div>
            <SymptomHistory />
          </div>
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

export default SuiviPalliatif;
