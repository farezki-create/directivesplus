
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import DirectivesGrid from "@/components/DirectivesGrid";
import { toast } from "@/components/ui/use-toast";

const Rediger = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if authentication state is loaded and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to auth page");
      // Pass the current location as state to redirect back after login
      navigate("/auth", { state: { from: location.pathname }, replace: true });
      return;
    }
    
    // Only show welcome toast if user is authenticated and loaded
    if (!isLoading && isAuthenticated && user) {
      console.log("User authenticated:", user.id);
      // Show a welcome toast when authenticated user arrives
      toast({
        title: "Bienvenue sur la page de rédaction",
        description: "Vous pouvez commencer à rédiger vos directives.",
      });
    }
  }, [isAuthenticated, isLoading, navigate, user, location.pathname]);

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

export default Rediger;
