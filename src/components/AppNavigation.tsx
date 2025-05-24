
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, FileText, Users, Shield, User, LogOut, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AppNavigationProps {
  hideEditingFeatures?: boolean;
}

const AppNavigation = ({ hideEditingFeatures = false }: AppNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Rédiger", href: "/rediger", icon: FileText, requireAuth: true, hideInCodeAccess: true },
    { name: "Mes Directives", href: "/mes-directives", icon: BookOpen, requireAuth: true, hideInCodeAccess: true },
    { name: "Données Médicales", href: "/donnees-medicales", icon: Shield },
    { name: "Témoignages", href: "/testimonials", icon: Users },
  ];

  const filteredNavItems = navItems.filter(item => {
    // Masquer les éléments qui nécessitent une auth si pas authentifié
    if (item.requireAuth && !isAuthenticated) return false;
    
    // Masquer les éléments d'édition si on est en mode accès par code
    if (hideEditingFeatures && item.hideInCodeAccess) return false;
    
    return true;
  });

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">DirectivesPlus</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && !hideEditingFeatures ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profil
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : !isAuthenticated && !hideEditingFeatures ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 p-2 rounded-md"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && !hideEditingFeatures ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              ) : !isAuthenticated && !hideEditingFeatures ? (
                <Link
                  to="/auth"
                  className="text-blue-600 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Connexion
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavigation;
