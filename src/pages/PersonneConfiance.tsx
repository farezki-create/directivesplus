
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
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/80 rounded-lg p-2">
                <img 
                  src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
                  alt="DirectivesPlus" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <p className="text-gray-500">© 2025 DirectivesPlus. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default PersonneConfiance;
