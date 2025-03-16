
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";
import { cleanupUserData, cleanupLocalStorage } from "@/utils/auth-cleanup";

interface AuthButtonsProps {
  user: User | null;
}

export const AuthButtons = ({ user }: AuthButtonsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Determine if we're in writing mode
  const isWritingMode = location.search.includes('writing=true');

  const handleSignOut = async () => {
    if (user) {
      try {
        // First clean up user data in database
        await cleanupUserData(user.id);
        
        // Then clean up local storage
        cleanupLocalStorage();
        
        // Log out user and redirect
        await supabase.auth.signOut();
        console.log("User signed out successfully");
        navigate("/");
      } catch (signOutError) {
        console.error("Error during sign out:", signOutError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la déconnexion.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogin = () => {
    // Always pass the writing parameter to the auth page
    navigate("/auth?writing=true");
  };

  const navButtonClass = "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-white";

  return user ? (
    <Button variant="default" onClick={handleSignOut} className={navButtonClass}>
      {t('logout')}
    </Button>
  ) : (
    <Button variant="default" onClick={handleLogin} className={navButtonClass}>
      {t('login')}
    </Button>
  );
};
