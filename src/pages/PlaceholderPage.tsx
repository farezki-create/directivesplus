
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavigation from "@/components/AppNavigation";
import { useAuth } from "@/contexts/AuthContext";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import TrustedPersonsManager from "@/components/trusted-persons/TrustedPersonsManager";
import ExamplesSection from "@/components/questionnaire/ExamplesSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const PlaceholderPage = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: `/${pageId}` } });
    }
  }, [isAuthenticated, isLoading, navigate, pageId]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Important: Only render page content if authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check if the current page is a questionnaire page
  const questionnaireSections = [
    'avis-general',
    'maintien-vie',
    'maladie-avancee',
    'gouts-peurs'
  ];
  
  // Explicitly check if pageId is 'personne-confiance'
  const isTrustedPersonsPage = pageId === 'personne-confiance';
  const isQuestionnairePage = questionnaireSections.includes(pageId || '');
  const isExamplesPage = pageId === 'exemples-phrases';

  console.log('Current pageId:', pageId);
  console.log('Is trusted persons page:', isTrustedPersonsPage);
  
  // Show toast notification for the trusted persons page
  useEffect(() => {
    if (isTrustedPersonsPage) {
      toast({
        title: "Page personne de confiance",
        description: "Vous pouvez ajouter vos personnes de confiance ici."
      });
    }
  }, [isTrustedPersonsPage]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {isQuestionnairePage ? (
          <QuestionnaireSection />
        ) : isTrustedPersonsPage ? (
          <TrustedPersonsManager />
        ) : isExamplesPage ? (
          <ExamplesSection />
        ) : (
          <div>
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => navigate("/rediger")}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Retour à la rédaction
              </Button>
            </div>
            
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">
                Page en construction
              </h1>
              <p className="text-gray-600">
                Cette section sera disponible prochainement.
              </p>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default PlaceholderPage;
