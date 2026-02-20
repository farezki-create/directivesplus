
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import AlertsManager from "@/components/symptom-tracker/AlertsManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AlertesSoignants = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/alertes-soignants" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Vérifier si l'utilisateur est un soignant (via rôle admin)
  const { isAdmin: isSoignant } = useAuth();

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
              Gestion des Alertes
            </h1>
            <p className="text-gray-600 text-lg">
              Surveillez et gérez les alertes de symptômes critiques des patients
            </p>
          </div>

          <AlertsManager />
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

export default AlertesSoignants;
