
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, Home } from 'lucide-react';

const AppNavigation = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
                alt="DirectivesPlus" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-semibold text-directiveplus-600">
                DirectivesPlus
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            </Link>
            
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  <User className="w-4 h-4 inline mr-1" />
                  {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavigation;
