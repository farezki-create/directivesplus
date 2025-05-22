
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

  return (
    <header className="bg-white sticky top-0 z-10 border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-directiveplus-600">
                DirectivesPlus
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-directiveplus-600 transition-colors"
            >
              Accueil
            </Link>
            
            <Link
              to="/mes-directives"
              className="text-gray-700 hover:text-directiveplus-600 transition-colors"
            >
              Accès directives
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  Mon Dossier
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  Profil
                </Link>
                <button
                  onClick={signOut}
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
              to="/"
              className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
            >
              Accueil
            </Link>
            <Link
              to="/mes-directives"
              className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
            >
              Accès directives
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
                >
                  Mon Dossier
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
                >
                  Profil
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
                >
                  Connexion
                </Link>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-directiveplus-600 transition-colors block"
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
