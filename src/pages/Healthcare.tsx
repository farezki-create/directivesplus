import { AuthForm } from "@/components/AuthForm";
import { Header } from "@/components/Header";
import { useHealthcareAuth } from "@/hooks/useHealthcareAuth";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";

const Healthcare = () => {
  const { isSignUp, setIsSignUp, handleSubmit } = useHealthcareAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {isSignUp ? "Inscription Professionnel de Santé" : "Connexion Professionnel de Santé"}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 text-center">
            {isSignUp 
              ? "Créez votre compte professionnel de santé en quelques étapes simples"
              : "Accédez à votre espace professionnel de santé"}
          </p>

          <div className="max-w-md mx-auto mb-12">
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