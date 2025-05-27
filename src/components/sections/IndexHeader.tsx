
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const IndexHeader = () => {
  const { isAuthenticated, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    console.log("🔴 === IndexHeader: BOUTON DÉCONNEXION CLIQUÉ === 🔴");
    
    try {
      await signOut();
    } catch (error) {
      console.error('❌ IndexHeader: Erreur lors de la déconnexion:', error);
      console.log("🚨 IndexHeader: REDIRECTION DE SECOURS");
      window.location.replace('/auth');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-directiveplus-500 to-directiveplus-700 rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <img 
                src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
                alt="DirectivesPlus" 
                className="h-8 w-auto filter brightness-0 invert"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-directiveplus-600 to-directiveplus-800 bg-clip-text text-transparent">
              DirectivesPlus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a 
              href="#features" 
              className="relative text-gray-700 hover:text-directiveplus-600 transition-colors duration-200 font-medium group"
            >
              Fonctionnalités
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-directiveplus-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#how-it-works" 
              className="relative text-gray-700 hover:text-directiveplus-600 transition-colors duration-200 font-medium group"
            >
              Comment ça marche
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-directiveplus-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#community" 
              className="relative text-gray-700 hover:text-directiveplus-600 transition-colors duration-200 font-medium group"
            >
              Communauté
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-directiveplus-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#testimonials" 
              className="relative text-gray-700 hover:text-directiveplus-600 transition-colors duration-200 font-medium group"
            >
              Témoignages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-directiveplus-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              to="/actualites-sante" 
              className="text-directiveplus-600 hover:text-directiveplus-700 font-medium transition-colors duration-200"
            >
              Actualités Santé
            </Link>
            <Link 
              to="/acces-institution" 
              className="text-directiveplus-600 hover:text-directiveplus-700 font-medium transition-colors duration-200"
            >
              Accès Institution
            </Link>
            
            {!isAuthenticated ? (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-directiveplus-600 to-directiveplus-700 hover:from-directiveplus-700 hover:to-directiveplus-800 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Connexion
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={handleSignOut}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Déconnexion
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200/20">
            <div className="flex flex-col space-y-4 pt-4">
              <a 
                href="#features" 
                className="text-gray-700 hover:text-directiveplus-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a 
                href="#how-it-works" 
                className="text-gray-700 hover:text-directiveplus-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Comment ça marche
              </a>
              <a 
                href="#community" 
                className="text-gray-700 hover:text-directiveplus-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Communauté
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-700 hover:text-directiveplus-600 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Témoignages
              </a>
              <Link 
                to="/actualites-sante" 
                className="text-directiveplus-600 hover:text-directiveplus-700 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Actualités Santé
              </Link>
              <Link 
                to="/acces-institution" 
                className="text-directiveplus-600 hover:text-directiveplus-700 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accès Institution
              </Link>
              
              <div className="pt-4 border-t border-gray-200/20">
                {!isAuthenticated ? (
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-directiveplus-600 to-directiveplus-700 hover:from-directiveplus-700 hover:to-directiveplus-800 text-white rounded-full font-medium shadow-lg">
                      Connexion
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-medium shadow-lg"
                  >
                    Déconnexion
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default IndexHeader;
