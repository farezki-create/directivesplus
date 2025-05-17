
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import DirectivesGrid from "@/components/DirectivesGrid";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Move useEffect hook to the top level - must be called unconditionally
  useEffect(() => {
    // Only redirect if authentication state is loaded and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Only render the main content if the user is authenticated
  // This prevents a flash of content before redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
            Vos directives anticipées en toute simplicité
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées.
          </p>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-left">
            <h2 className="text-xl font-semibold text-directiveplus-700 mb-3">Comment utiliser DirectivesPlus :</h2>
            <p className="text-gray-600 mb-3">Après connexion:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Répondre aux 4 questionnaires: <span className="font-medium">1</span>, <span className="font-medium">2</span>, <span className="font-medium">3</span> et <span className="font-medium">4</span>.</li>
              <li>Rajouter aux choix, un texte libre et des phrases types: <span className="font-medium">5</span>.</li>
              <li>Désigner la personne de confiance: <span className="font-medium">6</span>.</li>
              <li>Consulter la synthèse: <span className="font-medium">7</span>.</li>
              <li>Enregistrer.</li>
              <li>Signer.</li>
              <li>Générer les directives anticipées en format PDF.</li>
              <li>Télécharger, Partager.</li>
            </ol>
          </div>
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

export default Dashboard;
