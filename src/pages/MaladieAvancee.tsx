
import AppNavigation from "@/components/AppNavigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const MaladieAvancee = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-6">
              Maladie Avancée
            </h1>
            
            <QuestionnaireSection 
              type="advanced_illness"
              title="Indiquez vos préférences pour les soins en cas de maladie grave"
              description="Dans cette section, vous pouvez spécifier vos souhaits concernant les soins que vous aimeriez recevoir en cas de maladie avancée."
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

export default MaladieAvancee;
