
import AppNavigation from "@/components/AppNavigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import TrustedPersonsSection from "@/components/questionnaire/TrustedPersonsSection";

const PersonneConfiance = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-6">
              Personne de Confiance
            </h1>
            
            <p className="text-gray-600 mb-6">
              Désignez une ou plusieurs personnes de confiance qui pourront vous représenter 
              et s'exprimer en votre nom concernant vos soins médicaux si vous n'êtes plus 
              en mesure de le faire vous-même.
            </p>
            
            <TrustedPersonsSection />
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

export default PersonneConfiance;
