
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavigation from "@/components/AppNavigation";
import { useAuth } from "@/contexts/AuthContext";
import QuestionnaireSection from "@/components/QuestionnaireSection";

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
  const isQuestionnairePage = [
    'avis-general',
    'maintien-vie',
    'maladie-avancee',
    'gouts-peurs',
    'personne-confiance',
    'exemples-phrases'
  ].includes(pageId || '');

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {isQuestionnairePage ? (
          <QuestionnaireSection />
        ) : (
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">
              Page en construction
            </h1>
            <p className="text-gray-600">
              Cette section sera disponible prochainement.
            </p>
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
