
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import DirectivesGrid from "@/components/DirectivesGrid";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import InfoSteps from "@/components/InfoSteps";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

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
              className="w-64 h-auto" // Reduced logo size to match homepage
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
