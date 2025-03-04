
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

interface HeaderUserControlsProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const HeaderUserControls = ({ user, setUser }: HeaderUserControlsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

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

  return (
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
  );
};
