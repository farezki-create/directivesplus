import { AuthForm } from "@/components/AuthForm";
import { Header } from "@/components/Header";
import { useHealthcareAuth } from "@/hooks/useHealthcareAuth";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/SignaturePad";
import { useState } from "react";

const Healthcare = () => {
  const { isSignUp, setIsSignUp, handleSubmit } = useHealthcareAuth();
  const navigate = useNavigate();
  const [showSignature, setShowSignature] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const handleFormSubmit = async (values: any) => {
    if (isSignUp) {
      setFormData(values);
      setShowSignature(true);
    } else {
      await handleSubmit(values);
    }
  };

  const handleSignatureSave = async (signatureData: string) => {
    if (formData) {
      localStorage.setItem('healthcareProfessionalSignature', signatureData);
      await handleSubmit({
        ...formData,
        signature: signatureData
      });
      setShowSignature(false);
    }
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
            {showSignature ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center mb-4">
                  Signature Électronique
                </h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Veuillez signer ci-dessous pour confirmer votre inscription
                </p>
                <SignaturePad onSave={handleSignatureSave} />
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/healthcare-landing")}
                  className="w-full mb-8"
                >
                  Accéder à l'espace professionnel
                </Button>

                <AuthForm
                  isSignUp={isSignUp}
                  onSubmit={handleFormSubmit}
                  onToggleMode={() => setIsSignUp(!isSignUp)}
                  isHealthcareProfessional={true}
                />
              </>
            )}
          </div>

          <FeatureHighlights />
        </div>
      </main>
    </div>
  );
};

export default Healthcare;