
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, UserPlus, LogOut, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <h1 className="text-xl font-bold text-directiveplus-700">DirectivePlus</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/soutenir" className="text-directiveplus-600 hover:text-directiveplus-700 px-3 py-2 font-medium flex items-center">
              <Heart className="mr-1 h-4 w-4" />
              Soutenir
            </Link>
            {profile?.role === "institution" && (
              <Link to="/admin" className="text-directiveplus-600 hover:text-directiveplus-700 px-3 py-2 font-medium">
                Administration
              </Link>
            )}
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      className="border-directiveplus-200 text-directiveplus-700 hover:bg-directiveplus-50"
                      onClick={() => navigate('/profile')}
                    >
                      <User size={18} className="mr-2" />
                      {profile?.first_name || 'Profil'}
                    </Button>
                    <Button 
                      className="bg-directiveplus-600 hover:bg-directiveplus-700"
                      onClick={signOut}
                    >
                      <LogOut size={18} className="mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      className="border-directiveplus-200 text-directiveplus-700 hover:bg-directiveplus-50"
                      onClick={handleLoginClick}
                    >
                      Se connecter
                    </Button>
                    <Button 
                      className="bg-directiveplus-600 hover:bg-directiveplus-700"
                      onClick={handleLoginClick}
                    >
                      <UserPlus size={18} className="mr-2" />
                      Inscription
                    </Button>
                  </div>
                )}
              </>
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
            <Link 
              to="/soutenir" 
              className="block px-3 py-2 text-directiveplus-600 hover:text-directiveplus-700 font-medium flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="mr-1 h-4 w-4" />
              Soutenir
            </Link>
            {profile?.role === "institution" && (
              <Link 
                to="/admin" 
                className="block px-3 py-2 text-directiveplus-600 hover:text-directiveplus-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Administration
              </Link>
            )}
            <div className="mt-4 flex flex-col space-y-2">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="border-directiveplus-200 text-directiveplus-700 hover:bg-directiveplus-50 w-full"
                        onClick={() => {
                          navigate('/profile');
                          setIsMenuOpen(false);
                        }}
                      >
                        <User size={18} className="mr-2" />
                        Profil
                      </Button>
                      <Button 
                        className="bg-directiveplus-600 hover:bg-directiveplus-700 w-full"
                        onClick={signOut}
                      >
                        <LogOut size={18} className="mr-2" />
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="border-directiveplus-200 text-directiveplus-700 hover:bg-directiveplus-50 w-full"
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                      >
                        Se connecter
                      </Button>
                      <Button 
                        className="bg-directiveplus-600 hover:bg-directiveplus-700 w-full"
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                      >
                        <UserPlus size={18} className="mr-2" />
                        Inscription
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
