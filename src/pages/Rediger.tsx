
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Rediger = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the auth state is loaded and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to auth page");
      navigate("/auth", { state: { from: "/rediger" } });
    } else if (!isLoading && isAuthenticated) {
      console.log("User authenticated:", user?.id);
      // Show a welcome toast when authenticated user arrives
      toast({
        title: "Bienvenue sur la page de rédaction",
        description: "Vous pouvez commencer à rédiger vos directives.",
      });
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Important: Only render page content if authenticated
  // This prevents flash of content before redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
            Vos directives anticipées en toute simplicité
          </h1>
          <p className="text-gray-600 text-lg">
            Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées.
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/avis-general">
              <div className="bg-blue-900 text-white rounded-lg p-6 text-center hover:bg-blue-800 transition-colors">
                <h3 className="text-xl font-medium">Avis général</h3>
              </div>
            </Link>
            
            <Link to="/maintien-vie">
              <div className="bg-blue-900 text-white rounded-lg p-6 text-center hover:bg-blue-800 transition-colors">
                <h3 className="text-xl font-medium">Maintien de la vie</h3>
              </div>
            </Link>
            
            <Link to="/maladie-avancee">
              <div className="bg-blue-900 text-white rounded-lg p-6 text-center hover:bg-blue-800 transition-colors">
                <h3 className="text-xl font-medium">Maladie avancée</h3>
              </div>
            </Link>
            
            <Link to="/gouts-peurs">
              <div className="bg-blue-900 text-white rounded-lg p-6 text-center hover:bg-blue-800 transition-colors">
                <h3 className="text-xl font-medium">Mes goûts et mes peurs</h3>
              </div>
            </Link>
            
            <Link to="/personne-confiance">
              <div className="bg-blue-900 text-white rounded-lg p-6 text-center hover:bg-blue-800 transition-colors">
                <h3 className="text-xl font-medium">Personne de confiance</h3>
              </div>
            </Link>
            
            <Link to="/exemples-phrases">
              <div className="bg-blue-900 text-white rounded-lg p-6 text-center hover:bg-blue-800 transition-colors">
                <h3 className="text-xl font-medium">Exemples de phrases à utiliser</h3>
              </div>
            </Link>
          </div>
          
          <div className="flex justify-center pt-6">
            <Button 
              className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg rounded-lg"
              asChild
            >
              <Link to="/synthese">
                Synthèse
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Rediger;
