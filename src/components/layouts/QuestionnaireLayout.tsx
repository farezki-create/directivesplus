
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuestionnaireLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const QuestionnaireLayout: React.FC<QuestionnaireLayoutProps> = ({ 
  children, 
  title = "Questionnaire" 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-background">
      <AppNavigation />
      
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 lg:px-8 py-8">
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
            <h1 className="text-2xl font-bold text-center mb-6">
              {title}
            </h1>
            {children}
          </div>
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
