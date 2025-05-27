
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    console.log("🔴 === Header: BOUTON DÉCONNEXION CLIQUÉ === 🔴");
    
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('❌ Header: Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, fermer le menu et forcer la redirection radicale
      setIsMobileMenuOpen(false);
      console.log("🚨 Header: REDIRECTION DE SECOURS");
      window.location.replace('/auth');
    }
  };

  return (
    <header className="bg-white sticky top-0 z-10 border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/rediger" : "/"} className="flex items-center">
              <div className="bg-white/80 rounded-lg p-2 mr-3">
                <img 
                  src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
                  alt="DirectivesPlus" 
                  className="h-10 w-auto"
                />
              </div>
              <span className="text-xl font-bold text-directiveplus-600">
                DirectivesPlus
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to={isAuthenticated ? "/rediger" : "/"}
              className="text-gray-700 hover:text-directiveplus-600 transition-colors"
            >
              Accueil
            </Link>
            
            <Link
              to="/actualites-sante"
              className="text-gray-700 hover:text-directiveplus-600 transition-colors"
            >
              Actualités Santé
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/community"
                className="text-gray-700 hover:text-directiveplus-600 transition-colors"
              >
                Communauté
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  Profil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-directiveplus-600 focus:outline-none">
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="bg-gray-50 border-b py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link
              to={isAuthenticated ? "/rediger" : "/"}
              className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/actualites-sante"
              className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Actualités Santé
            </Link>
            {isAuthenticated && (
              <Link
                to="/community"
                className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Communauté
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors block text-left w-full"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
