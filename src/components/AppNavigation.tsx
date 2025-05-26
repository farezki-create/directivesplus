
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, User, FileText, Heart, Shield } from "lucide-react";

interface AppNavigationProps {
  hideEditingFeatures?: boolean;
}

const AppNavigation: React.FC<AppNavigationProps> = ({ hideEditingFeatures = false }) => {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-directiveplus-600" />
            <span className="text-xl font-bold text-directiveplus-700">DirectivesPlus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/en-savoir-plus" 
              className="text-gray-600 hover:text-directiveplus-600 transition-colors"
            >
              En savoir plus
            </Link>
            
            {isAuthenticated && !hideEditingFeatures ? (
              <>
                <Link 
                  to="/rediger" 
                  className="text-gray-600 hover:text-directiveplus-600 transition-colors flex items-center gap-2"
                >
                  <FileText size={16} />
                  Rédiger
                </Link>
                <Link 
                  to="/donnees-medicales" 
                  className="text-gray-600 hover:text-directiveplus-600 transition-colors flex items-center gap-2"
                >
                  <Shield size={16} />
                  Données médicales
                </Link>
                <Link 
                  to="/mes-directives" 
                  className="text-gray-600 hover:text-directiveplus-600 transition-colors"
                >
                  Mes directives
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-directiveplus-600 transition-colors flex items-center gap-2"
                >
                  <User size={16} />
                  Profil
                </Link>
                <Button onClick={handleLogout} variant="outline">
                  Déconnexion
                </Button>
              </>
            ) : !isAuthenticated && !hideEditingFeatures ? (
              <>
                <Link 
                  to="/mes-directives" 
                  className="text-gray-600 hover:text-directiveplus-600 transition-colors"
                >
                  Mes directives
                </Link>
                <Link 
                  to="/donnees-medicales" 
                  className="text-gray-600 hover:text-directiveplus-600 transition-colors"
                >
                  Données médicales
                </Link>
                <Link to="/auth">
                  <Button>Connexion</Button>
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          {!hideEditingFeatures && (
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && !hideEditingFeatures && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/en-savoir-plus" 
                className="text-gray-600 hover:text-directiveplus-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                En savoir plus
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/rediger" 
                    className="text-gray-600 hover:text-directiveplus-600 transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText size={16} />
                    Rédiger
                  </Link>
                  <Link 
                    to="/donnees-medicales" 
                    className="text-gray-600 hover:text-directiveplus-600 transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield size={16} />
                    Données médicales
                  </Link>
                  <Link 
                    to="/mes-directives" 
                    className="text-gray-600 hover:text-directiveplus-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes directives
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-600 hover:text-directiveplus-600 transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} />
                    Profil
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="w-fit">
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/mes-directives" 
                    className="text-gray-600 hover:text-directiveplus-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes directives
                  </Link>
                  <Link 
                    to="/donnees-medicales" 
                    className="text-gray-600 hover:text-directiveplus-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Données médicales
                  </Link>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-fit">Connexion</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavigation;
export type { AppNavigationProps };
