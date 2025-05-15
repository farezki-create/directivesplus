
import AppNavigation from "@/components/AppNavigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ExamplesSection from "@/components/questionnaire/ExamplesSection";

const ExemplesPhrases = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-6">
              Exemples de Phrases
            </h1>
            
            <p className="text-gray-600 mb-6">
              Inspirez-vous des exemples ci-dessous pour rédiger vos directives anticipées. 
              Ces phrases peuvent vous aider à formuler vos souhaits de manière claire.
            </p>
            
            <ExamplesSection />
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

export default ExemplesPhrases;
