
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Globe, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AppNavigation = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // Note: No need for navigate here as signOut already handles it
  };

  return (
    <nav className="bg-white shadow-sm py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link to="/dashboard" className="text-xl font-bold text-directiveplus-700">
              DirectivesPlus
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-directiveplus-600 font-medium">
                Accueil
              </Link>
              <Link to="/rediger" className="text-gray-700 hover:text-directiveplus-600 font-medium">
                Je rédige
              </Link>
              <Link to="/mes-directives" className="text-gray-700 hover:text-directiveplus-600 font-medium">
                Mes directives
              </Link>
              <Link to="/avis" className="text-gray-700 hover:text-directiveplus-600 font-medium">
                Avis
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="rounded-full p-2">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Changer de langue</span>
            </Button>
            <Button 
              onClick={handleLogout}
              className="bg-directiveplus-600 hover:bg-directiveplus-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavigation;
