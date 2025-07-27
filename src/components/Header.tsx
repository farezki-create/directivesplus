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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/rediger" : "/"} className="flex items-center">
              <div className="p-2 mr-3">
                <img 
                  src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
                  alt="DirectivesPlus" 
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <span className="text-xl font-bold text-directiveplus-600">
                DirectivesPlus
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to={isAuthenticated ? "/rediger" : "/"}
              className="text-gray-700 hover:text-directiveplus-600 transition-colors"
            >
              Accueil
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
          </nav>

          {/* User Menu */}
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

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to={isAuthenticated ? "/rediger" : "/"}
              className="text-gray-700 hover:text-directiveplus-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            {isAuthenticated && (
              <Link
                to="/community"
                className="text-gray-700 hover:text-directiveplus-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Communauté
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-directiveplus-600 block px-3 py-2 rounded-md text-base font-medium"
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
                  className="text-gray-700 hover:text-directiveplus-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-directiveplus-600 block px-3 py-2 rounded-md text-base font-medium"
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
