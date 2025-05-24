
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import LoadingState from "@/components/questionnaire/LoadingState";
import BackButton from "@/components/ui/back-button";
import { UnifiedAccessCodeCard } from "@/components/access-code/UnifiedAccessCodeCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

/**
 * Page unifiée pour la gestion des codes d'accès
 * Remplace AccessCardPage et autres pages similaires
 */
const AccessCodePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
      navigate("/auth", { state: { from: "/codes-acces" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <LoadingState loading={true} message="Chargement en cours..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BackButton 
            className="mb-6" 
            label="Retour au tableau de bord"
            onClick={() => navigate("/dashboard")}
          />
          
          {/* En-tête de la page */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-4">
              Gestion des codes d'accès
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gérez vos codes d'accès pour partager vos documents médicaux en toute sécurité.
            </p>
          </div>

          {/* Alerte d'information */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Système unifié :</strong> Deux types de codes sont disponibles - 
              permanent (toujours le même) et temporaire (avec expiration). 
              Choisissez selon vos besoins de partage.
            </AlertDescription>
          </Alert>
          
          {/* Contenu principal */}
          <UnifiedAccessCodeCard />

          {/* Instructions d'utilisation */}
          <div className="mt-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-directiveplus-800">
                Comment utiliser vos codes d'accès
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Code permanent</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Toujours le même pour vous</li>
                    <li>• À partager avec vos médecins de confiance</li>
                    <li>• Peut être imprimé au format carte</li>
                    <li>• Accès immédiat à tous vos documents</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-blue-600">Code temporaire</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Expire automatiquement (30 jours)</li>
                    <li>• Pour un partage ponctuel</li>
                    <li>• Peut être révoqué à tout moment</li>
                    <li>• Sécurité renforcée</li>
                  </ul>
                </div>
              </div>
            </div>
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

export default AccessCodePage;
