

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const IndexHeader = () => {
  const { isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    console.log("🔴 === IndexHeader: BOUTON DÉCONNEXION CLIQUÉ === 🔴");
    
    try {
      await signOut();
    } catch (error) {
      console.error('❌ IndexHeader: Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, forcer la redirection radicale
      console.log("🚨 IndexHeader: REDIRECTION DE SECOURS");
      window.location.replace('/auth');
    }
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-white/80 rounded-lg p-2">
              <img 
                src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
                alt="DirectivesPlus" 
                className="h-16 w-auto"
              />
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#community" className="text-gray-600 hover:text-directiveplus-600 transition-colors">
              Communauté
            </a>
            <Link to="/actualites-sante" className="text-directiveplus-600 hover:text-directiveplus-700 font-medium transition-colors">
              Actualités Santé
            </Link>
            <Link to="/acces-institution" className="text-directiveplus-600 hover:text-directiveplus-700 font-medium transition-colors">
              Accès Institution
            </Link>
            {!isAuthenticated ? (
              <Link to="/auth">
                <Button className="bg-directiveplus-600 hover:bg-directiveplus-700">
                  Rédiger mes Directives
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700"
              >
                Déconnexion
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default IndexHeader;

