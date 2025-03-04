
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { CreditCard, MessageSquare, FileEdit, Home } from "lucide-react";
import { PurchaseDialog } from "./purchase/PurchaseDialog";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const deleteUserDirectives = async (userId: string) => {
    try {
      console.log("[Logout] Deleting directives for user:", userId);
      
      // Delete directives
      const { error: directivesError } = await supabase
        .from("directives")
        .delete()
        .eq("user_id", userId);
      
      if (directivesError) {
        console.error("[Logout] Error deleting directives:", directivesError);
        throw directivesError;
      }
      
      // Delete general responses
      const { error: generalError } = await supabase
        .from("questionnaire_general_responses")
        .delete()
        .eq("user_id", userId);
      
      if (generalError) {
        console.error("[Logout] Error deleting general responses:", generalError);
        throw generalError;
      }
      
      // Delete life support responses
      const { error: lifeSupportError } = await supabase
        .from("questionnaire_life_support_responses")
        .delete()
        .eq("user_id", userId);
      
      if (lifeSupportError) {
        console.error("[Logout] Error deleting life support responses:", lifeSupportError);
        throw lifeSupportError;
      }
      
      // Delete advanced illness responses
      const { error: advancedIllnessError } = await supabase
        .from("questionnaire_advanced_illness_responses")
        .delete()
        .eq("user_id", userId);
      
      if (advancedIllnessError) {
        console.error("[Logout] Error deleting advanced illness responses:", advancedIllnessError);
        throw advancedIllnessError;
      }
      
      // Delete preferences responses
      const { error: preferencesError } = await supabase
        .from("questionnaire_preferences_responses")
        .delete()
        .eq("user_id", userId);
      
      if (preferencesError) {
        console.error("[Logout] Error deleting preferences responses:", preferencesError);
        throw preferencesError;
      }
      
      // Delete synthesis
      const { error: synthesisError } = await supabase
        .from("questionnaire_synthesis")
        .delete()
        .eq("user_id", userId);
      
      if (synthesisError) {
        console.error("[Logout] Error deleting synthesis:", synthesisError);
        throw synthesisError;
      }
      
      console.log("[Logout] Successfully deleted all directives data");
      
    } catch (error) {
      console.error("[Logout] Error during cleanup:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression des données",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    if (user) {
      const userId = user.id;
      
      try {
        // First delete the user's directives
        await deleteUserDirectives(userId);
        
        // Then sign them out
        await supabase.auth.signOut();
        
        toast({
          title: "Déconnexion réussie",
          description: "Toutes vos directives ont été supprimées",
        });
        
        navigate("/");
      } catch (error) {
        console.error("[Logout] Error during sign out process:", error);
        // Still attempt to sign out even if data deletion failed
        await supabase.auth.signOut();
        navigate("/");
      }
    }
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      <header className="w-full border-b">
        <div className="container mx-auto px-4">
          {/* Top level - Logo and User Authentication */}
          <div className="py-3 flex justify-between items-center border-b">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">DirectivesPlus</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {user ? (
                <Button variant="default" onClick={handleSignOut}>
                  {t('logout')}
                </Button>
              ) : (
                <Button variant="default" onClick={() => navigate("/auth")}>
                  {t('login')}
                </Button>
              )}
            </div>
          </div>
          
          {/* Second level - Navigation */}
          <div className="py-2">
            <nav className="flex items-center space-x-2 overflow-x-auto md:justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHomeClick}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                {t('home')}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/modify-directives")}
                className="flex items-center gap-2"
              >
                <FileEdit className="w-4 h-4" />
                {t('modifyDirectives')}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/reviews")}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {t('reviews')}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPurchaseDialog(true)}
                className="flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {t('buyCard')}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <PurchaseDialog 
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        user={user}
      />
    </>
  );
};
