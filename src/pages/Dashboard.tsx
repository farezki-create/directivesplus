
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, User, Settings, Heart } from "lucide-react";

const Dashboard = () => {
  const { user, profile, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Tableau de bord
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-directiveplus-600" />
                  Mes Directives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Gérez vos directives anticipées et documents médicaux
                </p>
                <Button 
                  onClick={() => window.location.href = '/mes-directives'}
                  className="w-full"
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-directiveplus-600" />
                  Mon Profil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Modifiez vos informations personnelles
                </p>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/profile'}
                  className="w-full"
                >
                  Voir le profil
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-directiveplus-600" />
                  Suivi Palliatif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Accès aux soins palliatifs et suivi médical
                </p>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/suivi-palliatif'}
                  className="w-full"
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Bienvenue, {profile?.first_name || 'Utilisateur'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vous êtes connecté en tant que <strong>{user?.email}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Utilisez le menu ci-dessus pour accéder à vos différents services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
