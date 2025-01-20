import { AuthForm } from "@/components/AuthForm";
import { Header } from "@/components/Header";
import { useHealthcareAuth } from "@/hooks/useHealthcareAuth";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Healthcare = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { loading, registerHealthcareProfessional } = useHealthcareAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await registerHealthcareProfessional(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mt-8">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {isSignUp ? "Inscription Professionnel de Santé" : "Connexion Professionnel de Santé"}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            {isSignUp 
              ? "Créez votre compte professionnel de santé en quelques étapes simples"
              : "Accédez à votre espace professionnel de santé"}
          </p>

          <div className="max-w-md mx-auto mb-16">
            <Button
              variant="outline"
              onClick={() => navigate("/healthcare-landing")}
              className="w-full mb-8"
            >
              Accéder à l'espace professionnel
            </Button>

            <AuthForm
              isSignUp={isSignUp}
              onSubmit={handleSubmit}
              onToggleMode={() => setIsSignUp(!isSignUp)}
              isHealthcareProfessional={true}
            />
          </div>

          <FeatureHighlights />
        </div>
      </main>
    </div>
  );
};

export default Healthcare;