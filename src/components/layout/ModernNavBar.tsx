
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  User, 
  FileText, 
  Heart, 
  Building2, 
  Shield, 
  LogOut, 
  Menu, 
  X,
  Bell,
  BarChart3,
  Settings
} from "lucide-react";

interface ModernNavBarProps {
  hideEditingFeatures?: boolean;
}

const ModernNavBar = ({ hideEditingFeatures = false }: ModernNavBarProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.email?.endsWith('@directivesplus.fr');

  const navigationItems = [
    { 
      path: "/profile", 
      label: "Mon Profil", 
      icon: User,
      hidden: hideEditingFeatures
    },
    { 
      path: "/mes-documents", 
      label: "Mes Documents", 
      icon: FileText,
      hidden: hideEditingFeatures
    },
    { 
      path: "/questionnaire", 
      label: "Questionnaire", 
      icon: Heart,
      hidden: hideEditingFeatures
    },
    { 
      path: "/suivi-symptomes", 
      label: "Suivi Symptômes", 
      icon: BarChart3,
      hidden: hideEditingFeatures
    },
    { 
      path: "/alert-management", 
      label: "Gestion Alertes", 
      icon: Bell,
      hidden: hideEditingFeatures
    }
  ];

  const adminItems = [
    { 
      path: "/admin/dashboard", 
      label: "Administration", 
      icon: Shield 
    },
    { 
      path: "/acces-institution", 
      label: "Accès Institution", 
      icon: Building2 
    }
  ];

  const publicItems = [
    { 
      path: "/acces-institution", 
      label: "Accès Professionnel", 
      icon: Building2 
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getItemsToShow = () => {
    if (hideEditingFeatures) {
      return isAdmin ? adminItems : publicItems;
    }
    return isAdmin ? [...navigationItems.filter(item => !item.hidden), ...adminItems] : navigationItems.filter(item => !item.hidden);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-xl border-b border-blue-800/30">
      {/* Barre principale */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
                alt="DirectivesPlus" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                DirectivesPlus
              </span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {getItemsToShow().map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                    ${isActive 
                      ? 'bg-blue-600/30 text-blue-100 shadow-lg border border-blue-500/30' 
                      : 'text-blue-200 hover:bg-blue-800/30 hover:text-white hover:scale-105'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-3">
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-blue-200 text-sm font-medium">
                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                  </p>
                  <p className="text-blue-300 text-xs">{user.email}</p>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-blue-200 hover:text-white hover:bg-red-600/20 border-red-400/30"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            )}

            {/* Menu mobile */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="md:hidden text-blue-200 hover:text-white hover:bg-blue-800/30"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Barre secondaire pour les raccourcis rapides */}
      {!hideEditingFeatures && (
        <div className="bg-gradient-to-r from-blue-800/40 to-indigo-800/40 border-t border-blue-700/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-6">
                <Link 
                  to="/carte-acces" 
                  className="flex items-center space-x-2 text-blue-200 hover:text-blue-100 transition-colors text-sm"
                >
                  <Settings size={14} />
                  <span>Carte d'Accès</span>
                </Link>
                <Link 
                  to="/synthesis" 
                  className="flex items-center space-x-2 text-blue-200 hover:text-blue-100 transition-colors text-sm"
                >
                  <FileText size={14} />
                  <span>Synthèse</span>
                </Link>
                <Link 
                  to="/trusted-persons" 
                  className="flex items-center space-x-2 text-blue-200 hover:text-blue-100 transition-colors text-sm"
                >
                  <User size={14} />
                  <span>Personnes de Confiance</span>
                </Link>
              </div>
              
              <div className="text-xs text-blue-300">
                Dernière connexion: {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-t border-blue-800/30">
          <div className="px-4 py-4 space-y-2">
            {getItemsToShow().map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600/30 text-blue-100 border border-blue-500/30' 
                      : 'text-blue-200 hover:bg-blue-800/30 hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {user && (
              <div className="pt-4 border-t border-blue-800/30">
                <div className="px-4 py-2">
                  <p className="text-blue-200 font-medium">
                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                  </p>
                  <p className="text-blue-300 text-sm">{user.email}</p>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-600/20"
                >
                  <LogOut size={16} className="mr-3" />
                  Se déconnecter
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default ModernNavBar;
