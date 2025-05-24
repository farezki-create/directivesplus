
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useReadOnlyAccess } from "@/hooks/useReadOnlyAccess";
import AppNavigation from "@/components/AppNavigation";
import DirectivesGrid from "@/components/DirectivesGrid";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
          <p className="text-gray-600 text-lg">
            {isReadOnlyAccess 
              ? "Consultez les directives anticipées et les personnes de confiance désignées."
              : "Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées."
            }
          </p>
        </div>
        
        <DirectivesGrid readOnly={isReadOnlyAccess} />
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
