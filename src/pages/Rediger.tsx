
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useReadOnlyAccess } from "@/hooks/useReadOnlyAccess";
import AppNavigation from "@/components/AppNavigation";
import DirectivesGrid from "@/components/DirectivesGrid";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Shield, Clock, Users, FileText, Heart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Rediger = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { hasEquivalentAuth, hasWriteAccess, isReadOnlyAccess, dossierActif } = useReadOnlyAccess(isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if no equivalent auth (neither authenticated nor code access)
    if (!isLoading && !hasEquivalentAuth) {
      console.log("User has no access, redirecting to auth page");
      navigate("/auth", { state: { from: location.pathname }, replace: true });
      return;
    }
    
    // Show appropriate welcome message
    if (!isLoading && hasEquivalentAuth) {
      if (isReadOnlyAccess) {
        toast({
          title: "Accès en lecture seule",
          description: "Vous consultez les directives en mode lecture seule via votre code d'accès.",
        });
      } else if (isAuthenticated && user) {
        toast({
          title: "Bienvenue sur la page de rédaction",
          description: "Vous pouvez commencer à rédiger vos directives.",
        });
      }
    }
  }, [hasEquivalentAuth, isLoading, navigate, user, location.pathname, isReadOnlyAccess, isAuthenticated]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Important: Only render page content if has equivalent auth
  if (!hasEquivalentAuth) {
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

        {/* Alerte pour l'accès en lecture seule */}
        {isReadOnlyAccess && dossierActif && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Eye className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Mode lecture seule</strong><br />
              Vous consultez les directives de {dossierActif.profileData?.first_name} {dossierActif.profileData?.last_name} via un code d'accès.
              Vous ne pouvez pas modifier ou ajouter de contenu.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
            {isReadOnlyAccess ? "Consultation des directives anticipées" : "Vos directives anticipées en toute simplicité"}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            {isReadOnlyAccess 
              ? "Consultez les directives anticipées et les personnes de confiance désignées."
              : "Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées."
            }
          </p>

          {/* Section explicative - seulement pour les utilisateurs authentifiés */}
          {!isReadOnlyAccess && (
            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <Card className="bg-white border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-center">Simple et guidé</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Notre questionnaire vous guide étape par étape pour rédiger vos directives en toute simplicité.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-lg bg-green-50">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-center">Sécurisé</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Vos données sont chiffrées et stockées de manière sécurisée. Vous gardez le contrôle total.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white border-purple-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-center">Accessible</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Générez un code d'accès pour permettre aux professionnels de santé de consulter vos directives.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <DirectivesGrid readOnly={isReadOnlyAccess} />

        {/* Section Carte d'accès - seulement pour les utilisateurs authentifiés */}
        {!isReadOnlyAccess && (
          <div className="max-w-4xl mx-auto mt-16">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl text-blue-800">
                    Accès Professionnel Sécurisé
                  </CardTitle>
                </div>
                <CardDescription className="text-lg text-blue-700">
                  Permettez aux professionnels de santé d'accéder à vos directives en cas d'urgence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">Accès immédiat</h4>
                      <p className="text-sm text-blue-600">
                        Les professionnels peuvent consulter vos directives instantanément avec votre code d'accès.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">Respect de vos volontés</h4>
                      <p className="text-sm text-blue-600">
                        Vos directives et personnes de confiance sont clairement accessibles en cas de besoin.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    onClick={() => navigate("/carte-acces")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Générer ma carte d'accès
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
