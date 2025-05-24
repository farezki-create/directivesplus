import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import DirectivesGrid from "@/components/DirectivesGrid";
import InfoSteps from "@/components/InfoSteps";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Users, CreditCard, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/dashboard" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      toast({
        title: "Bienvenue sur votre tableau de bord",
        description: "Gérez vos directives anticipées et vos données médicales",
      });
    }
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

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
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Button>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
              Tableau de bord
            </h1>
            <p className="text-gray-600 text-lg">
              Bienvenue {profile?.first_name || user?.user_metadata?.first_name || 'utilisateur'} ! 
              Gérez vos directives anticipées et vos données médicales en toute simplicité.
            </p>
          </div>

          {/* Actions rapides */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/mes-directives")}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-directiveplus-600" />
                  <CardTitle className="text-lg">Mes Directives</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Consultez et gérez vos directives anticipées
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/donnees-medicales")}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Données Médicales</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gérez vos documents et données médicales
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/codes-acces")}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Codes d'Accès</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gérez vos codes de partage sécurisés
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/profile")}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">Profil</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Modifiez vos informations personnelles
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="space-y-8">
            <InfoSteps />
            <DirectivesGrid />
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

export default Dashboard;
