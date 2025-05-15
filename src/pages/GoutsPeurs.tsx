
import AppNavigation from "@/components/AppNavigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const GoutsPeurs = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-6">
              Goûts et Peurs
            </h1>
            
            <QuestionnaireSection 
              type="preferences_fears"
              title="Partagez vos préférences personnelles et vos craintes concernant les soins"
              description="Dans cette section, vous pouvez indiquer vos préférences personnelles, vos goûts et vos peurs concernant les soins médicaux."
            />
          </div>
        </main>
        
        <footer className="bg-white py-6 border-t">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default GoutsPeurs;
