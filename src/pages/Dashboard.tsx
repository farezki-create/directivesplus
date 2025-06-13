
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  Heart, 
  BookOpen, 
  Settings,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/dashboard" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  const quickActions = [
    {
      title: "Rédiger mes directives",
      description: "Commencer ou continuer la rédaction de vos directives anticipées",
      icon: FileText,
      href: "/rediger",
      color: "bg-blue-500"
    },
    {
      title: "Mes directives",
      description: "Consulter et gérer vos directives existantes",
      icon: BookOpen,
      href: "/mes-directives",
      color: "bg-green-500"
    },
    {
      title: "Personnes de confiance",
      description: "Gérer vos personnes de confiance",
      icon: Users,
      href: "/personne-confiance",
      color: "bg-purple-500"
    },
    {
      title: "Suivi palliatif",
      description: "Suivre l'évolution de vos symptômes",
      icon: Heart,
      href: "/suivi-palliatif",
      color: "bg-pink-500"
    },
    {
      title: "Mon profil",
      description: "Modifier vos informations personnelles",
      icon: Settings,
      href: "/profile",
      color: "bg-gray-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
              Tableau de bord
            </h1>
            <p className="text-gray-600 text-lg">
              Bienvenue, gérez vos directives anticipées en toute simplicité
            </p>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Card key={action.href} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {action.description}
                    </CardDescription>
                    <Button 
                      onClick={() => navigate(action.href)}
                      className="w-full"
                      variant="outline"
                    >
                      Accéder
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Statut</h3>
                <p className="text-sm text-gray-600">Compte actif</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Directives</h3>
                <p className="text-sm text-gray-600">En cours de rédaction</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-pink-600" />
                <h3 className="font-semibold">Suivi</h3>
                <p className="text-sm text-gray-600">Disponible</p>
              </CardContent>
            </Card>
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
