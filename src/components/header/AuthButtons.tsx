
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";
import { cleanupLocalStorage } from "@/utils/auth-cleanup";
import { LogOut, Building } from "lucide-react";

interface AuthButtonsProps {
  user: User | null;
}

export const AuthButtons = ({
  user
}: AuthButtonsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    t
  } = useLanguage();

  // Determine if we're in writing mode
  const isWritingMode = location.search.includes('writing=true');

  const handleSignOut = async () => {
    if (user) {
      try {
        // Clean up local storage
        cleanupLocalStorage();

        // Display a toast message informing the user
        toast({
          title: "Déconnexion",
          description: "Vos données sont conservées de manière sécurisée sur nos serveurs HDS."
        });

        // Log out user first, then redirect to ensure session is properly cleared
        await supabase.auth.signOut();
        console.log("User signed out successfully");

        // Force navigation to home page and refresh to ensure complete cleanup
        window.location.href = "/";
      } catch (signOutError) {
        console.error("Error during sign out:", signOutError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la déconnexion.",
          variant: "destructive"
        });
      }
    }
  };

  const handleLogin = () => {
    // Always pass the writing parameter to the auth page
    navigate("/auth?writing=true");
  };

  const handleMedicalAccess = () => {
    navigate("/medical-access");
  };

  const navButtonClass = "flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-white";

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="outline" 
        onClick={handleMedicalAccess} 
        className="flex items-center gap-2 bg-white text-blue-700 border-blue-500 hover:bg-blue-50 mx-0 my-[5px] text-sm text-center"
      >
        <Building className="w-4 h-4" />
        <span>Accès professionnel</span>
      </Button>

      {user ? (
        <Button 
          variant="default" 
          onClick={handleSignOut} 
          className={navButtonClass}
        >
          <LogOut className="w-4 h-4 mr-1" />
          {t('logout')}
        </Button>
      ) : (
        <Button 
          variant="default" 
          onClick={handleLogin} 
          className={navButtonClass}
        >
          {t('login')}
        </Button>
      )}
    </div>
  );
};
