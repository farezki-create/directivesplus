
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  User, 
  LogOut, 
  Menu, 
  X, 
  FileText,
  CreditCard,
  Activity
} from "lucide-react";

interface AppNavigationProps {
  hideEditingFeatures?: boolean;
}

const AppNavigation = ({ hideEditingFeatures = false }: AppNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Simple navigation to home on logout
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
            <span className="text-xl font-bold text-directiveplus-700">
              DirectivesPlus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && !hideEditingFeatures && (
              <>
                <Link 
                  to="/rediger" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  <FileText size={16} />
                  <span>Rédiger</span>
                </Link>
                
                <Link 
                  to="/mes-directives" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  <FileText size={16} />
                  <span>Mes Directives</span>
                </Link>
                
                <Link 
                  to="/suivi-palliatif" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  <Activity size={16} />
                  <span>Suivi Palliatif</span>
                </Link>
                
                <Link 
                  to="/carte-acces" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-directiveplus-600 transition-colors"
                >
                  <CreditCard size={16} />
                  <span>Carte d'Accès</span>
                </Link>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                {!hideEditingFeatures && (
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-1 text-gray-700 hover:text-directiveplus-600 transition-colors"
                  >
                    <User size={16} />
                    <span>Profil</span>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              {user && !hideEditingFeatures && (
                <>
                  <Link 
                    to="/rediger" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-directiveplus-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText size={16} />
                    <span>Rédiger</span>
                  </Link>
                  
                  <Link 
                    to="/mes-directives" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-directiveplus-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText size={16} />
                    <span>Mes Directives</span>
                  </Link>
                  
                  <Link 
                    to="/suivi-palliatif" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-directiveplus-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Activity size={16} />
                    <span>Suivi Palliatif</span>
                  </Link>
                  
                  <Link 
                    to="/carte-acces" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-directiveplus-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CreditCard size={16} />
                    <span>Carte d'Accès</span>
                  </Link>
                </>
              )}
              
              {user ? (
                <>
                  {!hideEditingFeatures && (
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-directiveplus-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>Profil</span>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 justify-start"
                  >
                    <LogOut size={16} />
                    <span>Déconnexion</span>
                  </Button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="default" size="sm" className="w-full">
                    Connexion
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavigation;
