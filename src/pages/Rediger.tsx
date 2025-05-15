
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import DirectivesGrid from "@/components/DirectivesGrid";
import { toast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, PlusCircle, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

const Rediger = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if authentication state is loaded and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to auth page");
      navigate("/auth", { state: { from: "/rediger" } });
    } else if (!isLoading && isAuthenticated && user) {
      console.log("User authenticated:", user.id);
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
        
        <DirectivesGrid />
        
        {/* Additional Section for Medical Data and Examples */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Directives Links */}
          <Card className="shadow hover:shadow-md transition-shadow">
            <CardHeader className="bg-directiveplus-50 border-b">
              <CardTitle className="flex items-center text-directiveplus-800">
                <FileText className="mr-2 text-directiveplus-600" size={20} />
                Mes Directives
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">
                Consultez et gérez l'ensemble de vos documents de directives anticipées.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/mes-directives" className="flex items-center justify-center gap-2">
                  <PlusCircle size={16} />
                  Accéder à mes documents
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Medical Data */}
          <Card className="shadow hover:shadow-md transition-shadow">
            <CardHeader className="bg-directiveplus-50 border-b">
              <CardTitle className="flex items-center text-directiveplus-800">
                <HeartPulse className="mr-2 text-directiveplus-600" size={20} />
                Données Médicales
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">
                Ajoutez et gérez vos données médicales importantes accessibles en cas d'urgence.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/donnees-medicales" className="flex items-center justify-center gap-2">
                  <PlusCircle size={16} />
                  Gérer mes données médicales
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Example Phrases Section */}
        <div className="mt-12">
          <Card className="shadow hover:shadow-md transition-shadow">
            <CardHeader className="bg-directiveplus-50 border-b">
              <CardTitle className="flex items-center text-directiveplus-800">
                <FileText className="mr-2 text-directiveplus-600" size={20} />
                Exemples de Phrases
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">
                Consultez des exemples de phrases pour vous aider à rédiger vos directives anticipées.
              </p>
              <Button 
                asChild 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => navigate("/examples")}
              >
                <Link to="/examples" className="flex items-center justify-center gap-2">
                  <PlusCircle size={16} />
                  Voir les exemples
                </Link>
              </Button>
            </CardContent>
          </Card>
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
