
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const IndexHeader = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-white/80 rounded-lg p-3">
              <img 
                src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
                alt="DirectivesPlus" 
                className="h-12 w-auto"
              />
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-directiveplus-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-directiveplus-600 transition-colors">
              Comment ça marche
            </a>
            <a href="#community" className="text-gray-600 hover:text-directiveplus-600 transition-colors">
              Communauté
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-directiveplus-600 transition-colors">
              Témoignages
            </a>
            <Link to="/acces-institution" className="text-directiveplus-600 hover:text-directiveplus-700 font-medium transition-colors">
              Accès Institution
            </Link>
            {!isAuthenticated ? (
              <Link to="/auth">
                <Button className="bg-directiveplus-600 hover:bg-directiveplus-700">
                  Connexion
                </Button>
              </Link>
            ) : (
              <Link to="/rediger">
                <Button className="bg-directiveplus-600 hover:bg-directiveplus-700">
                  Mes Directives
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default IndexHeader;
