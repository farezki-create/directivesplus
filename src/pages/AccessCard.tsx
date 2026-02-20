
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import LoadingState from "@/components/questionnaire/LoadingState";
import BackButton from "@/components/ui/back-button";
import { AccessCodeGenerator } from "@/components/access-card/AccessCodeGenerator";
import { SecurityInfoCard } from "@/components/access-card/SecurityInfoCard";
import ProfileWarning from "@/components/access-card/ProfileWarning";
import PageFooter from "@/components/access-card/PageFooter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AccessCardPage = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  
  useEffect(() => {
    // Auth state tracked for access card
  }, [user, profile]);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
      navigate("/auth", { state: { from: "/carte-acces" } });
    } else if (isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || loading) {
    return <LoadingState loading={true} message="Chargement en cours..." />;
  }

  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BackButton 
            className="mb-6" 
            label="Retour au tableau de bord"
            onClick={() => navigate("/dashboard")}
          />
          
          {/* En-tête de la page */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-4">
              Carte d'accès professionnelle
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Votre code d'accès personnel permanent pour permettre aux professionnels de santé 
              d'accéder à vos directives anticipées en cas d'urgence.
            </p>
          </div>

          {/* Alerte d'information */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Code permanent :</strong> Votre code d'accès ne change jamais et peut être 
              imprimé au format carte bancaire pour un transport facile.
            </AlertDescription>
          </Alert>
          
          {/* Avertissement profil si nécessaire */}
          <ProfileWarning 
            profile={profile} 
            firstName={firstName} 
            lastName={lastName} 
          />
          
          {/* Contenu principal en grille */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Générateur de code d'accès */}
            <div>
              <AccessCodeGenerator 
                onCodeGenerated={setGeneratedCode}
              />
            </div>
            
            {/* Informations de sécurité */}
            <div>
              <SecurityInfoCard />
            </div>
          </div>

          {/* Instructions d'utilisation */}
          <div className="mt-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-directiveplus-800">
                Comment utiliser votre code d'accès permanent
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-directiveplus-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-directiveplus-600 font-bold text-lg">1</span>
                  </div>
                  <h4 className="font-medium mb-2">Code personnel</h4>
                  <p className="text-sm text-gray-600">
                    Votre code est unique et ne change jamais
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-directiveplus-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-directiveplus-600 font-bold text-lg">2</span>
                  </div>
                  <h4 className="font-medium mb-2">Partagez en confiance</h4>
                  <p className="text-sm text-gray-600">
                    Transmettez le code aux professionnels autorisés
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-directiveplus-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-directiveplus-600 font-bold text-lg">3</span>
                  </div>
                  <h4 className="font-medium mb-2">Accès permanent</h4>
                  <p className="text-sm text-gray-600">
                    Le professionnel accède à vos directives à tout moment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default AccessCardPage;
