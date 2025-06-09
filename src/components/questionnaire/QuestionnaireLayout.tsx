
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuestionnaireLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  currentStep?: number;
  totalSteps?: number;
}

const QuestionnaireLayout: React.FC<QuestionnaireLayoutProps> = ({ 
  children, 
  title = "Questionnaire",
  description,
  currentStep,
  totalSteps
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/rediger")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour à la rédaction
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-600 mb-4">
                {description}
              </p>
            )}
            {currentStep && totalSteps && (
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <span>Étape {currentStep} sur {totalSteps}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-directiveplus-600 h-2 rounded-full transition-all" 
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {children}
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/80 rounded-lg p-4">
              <img 
                src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
                alt="DirectivesPlus" 
                className="h-16 w-auto"
              />
            </div>
          </div>
          <p className="text-gray-500">© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default QuestionnaireLayout;
