
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LogIn, FileText, User, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import Logo from "./Logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Déconnexion réussie",
      description: "Vous êtes maintenant déconnecté",
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium">
              Accueil
            </Link>
            <Link to="/rediger" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium">
              Je rédige
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/mes-directives" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium">
                  Mes directives
                </Link>
                <Link to="/mes-documents" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium flex items-center">
                  <FileText className="mr-1 h-4 w-4" /> Mes documents
                </Link>
                <Link to="/mes-donnees-medicales" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" /> Mes données médicales
                </Link>
              </>
            )}
            
            <Link to="/faq" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium">
              FAQ
            </Link>
            <Link to="/langue" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium flex items-center">
              <span className="mr-1">🌐</span> Langue
            </Link>
            <Link to="/acces-professionnel" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium flex items-center">
              <User className="mr-1 h-4 w-4" /> Accès professionnel
            </Link>
          </nav>
          
          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <Button 
                onClick={handleSignOut} 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            ) : (
              <Button 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Link>
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-directiveplus-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
              Accueil
            </Link>
            <Link to="/rediger" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
              Je rédige
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/mes-directives" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
                  Mes directives
                </Link>
                <Link to="/mes-documents" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
                  Mes documents
                </Link>
                <Link to="/mes-donnees-medicales" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
                  Mes données médicales
                </Link>
              </>
            )}
            
            <Link to="/faq" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
              FAQ
            </Link>
            <Link to="/langue" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
              Langue
            </Link>
            <Link to="/acces-professionnel" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
              Accès professionnel
            </Link>
            
            <div className="mt-4">
              {isAuthenticated ? (
                <Button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              ) : (
                <Button 
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link to="/auth">
                    <LogIn className="h-4 w-4" />
                    Connexion
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
