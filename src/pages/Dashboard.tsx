
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import DirectivesGrid from "@/components/DirectivesGrid";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, FileText, FileSearch, Key, User, Lock } from "lucide-react";
import InfoSteps from "@/components/InfoSteps";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { verifierCode, loading: verifyingCode } = useVerifierCodeAcces();
  const { setDossierActif } = useDossierStore();
  const [accessCode, setAccessCode] = useState("");

  // Accéder directement au dossier avec un code
  const handleDirectAccess = async () => {
    if (!accessCode.trim()) {
      toast({
        title: "Code manquant",
        description: "Veuillez saisir un code d'accès",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await verifierCode(accessCode);
      
      if (result.success && result.dossier) {
        setDossierActif(result.dossier);
        
        toast({
          title: "Accès autorisé",
          description: "Redirection vers le dossier..."
        });
        
        // Rediriger vers la page d'affichage du dossier
        navigate("/affichage-dossier");
      } else {
        toast({
          title: "Accès refusé",
          description: result.error || "Code d'accès invalide",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du code",
        variant: "destructive"
      });
    }
  };

  // Move useEffect hook to the top level - must be called unconditionally
  useEffect(() => {
    // Only redirect if authentication state is loaded and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Only render the main content if the user is authenticated
  // This prevents a flash of content before redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home size={16} />
            Retour à l'accueil
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/0a786ed1-a905-4b29-be3a-ca3b24d3efae.png" 
              alt="DirectivesPlus Logo" 
              className="w-40 h-auto"
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
            Vos directives anticipées en toute simplicité
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées.
          </p>
          
          <InfoSteps />
        </div>
        
        {/* Accès direct par code */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-directiveplus-700">
                <Key size={20} />
                Accès direct par code
              </CardTitle>
              <CardDescription>
                Consultez directement un dossier en saisissant son code d'accès
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Saisissez le code d'accès"
                  className="font-mono"
                  maxLength={10}
                />
                <Button 
                  onClick={handleDirectAccess}
                  disabled={verifyingCode || !accessCode.trim()}
                  className="bg-directiveplus-600 hover:bg-directiveplus-700 whitespace-nowrap"
                >
                  {verifyingCode ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Vérification...
                    </>
                  ) : (
                    <>
                      <Lock size={16} className="mr-1" />
                      Accéder
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Ajout d'une section pour l'accès aux documents hors connexion */}
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-directiveplus-700 mb-4 text-center">
            Accès aux documents hors connexion
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Carte d'accès aux directives anticipées */}
            <Card className="shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-directiveplus-700">
                  <FileText size={18} />
                  Directives anticipées
                </CardTitle>
                <CardDescription>
                  Accédez aux directives anticipées d'un patient
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-gray-600">
                  Consultez les volontés d'un patient concernant sa fin de vie et les soins médicaux.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
                  onClick={() => navigate("/acces-directives")}
                >
                  Accéder aux directives
                </Button>
              </CardFooter>
            </Card>

            {/* Carte d'accès aux données médicales */}
            <Card className="shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <FileSearch size={18} />
                  Données médicales
                </CardTitle>
                <CardDescription>
                  Accédez aux données médicales d'un patient
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-gray-600">
                  Consultez les informations médicales importantes d'un patient pour sa prise en charge.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  style={{ backgroundColor: '#3b82f6', color: 'white' }}
                  onClick={() => navigate("/acces-medical")}
                >
                  Accéder aux données médicales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <DirectivesGrid />
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
