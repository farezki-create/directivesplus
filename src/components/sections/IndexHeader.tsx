
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const IndexHeader = () => {
  const { isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('IndexHeader: Erreur lors de la déconnexion:', error);
      window.location.replace('/auth');
    }
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2">
              <img 
                src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
                alt="DirectivesPlus" 
                className="h-14 sm:h-16 md:h-16 w-auto object-contain"
              />
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#community" className="text-gray-600 hover:text-directiveplus-600 transition-colors">
              Communauté
            </a>
            <Link to="/acces-institution" className="text-directiveplus-600 hover:text-directiveplus-700 font-medium transition-colors">
              Accès Institution
            </Link>
            {!isAuthenticated ? (
              <Link to="/auth">
                <Button className="bg-directiveplus-600 hover:bg-directiveplus-700">
                  Rédiger mes Directives
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700"
              >
                Déconnexion
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default IndexHeader;
