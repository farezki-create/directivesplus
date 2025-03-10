import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";

interface AuthButtonsProps {
  user: User | null;
}

export const AuthButtons = ({ user }: AuthButtonsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    if (user) {
      try {
        // Delete directives from Supabase
        const { error: directivesError } = await supabase
          .from("directives")
          .delete()
          .eq("user_id", user.id);
          
        if (directivesError) {
          console.error("Erreur lors de la suppression des directives:", directivesError);
        } else {
          console.log("Directives supprimées avec succès");
        }
        
        // Delete synthesis from Supabase
        const { error: synthesisError } = await supabase
          .from("questionnaire_synthesis")
          .delete()
          .eq("user_id", user.id);
          
        if (synthesisError) {
          console.error("Erreur lors de la suppression de la synthèse:", synthesisError);
        } else {
          console.log("Synthèse supprimée avec succès");
        }
        
        // Notify user of directive deletion
        toast({
          title: "Suppression des données",
          description: "Vos directives anticipées ont été supprimées avec succès.",
        });
      } catch (error) {
        console.error("Erreur lors du nettoyage des données:", error);
      }
    }
    
    // Delete locally stored PDFs
    const pdfUrls = Object.keys(localStorage).filter(key => 
      key.startsWith('pdf_') || key.includes('dataurlstring')
    );
    
    pdfUrls.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Revoke object URLs
    if (window.URL && window.URL.revokeObjectURL) {
      pdfUrls.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value && value.startsWith('blob:')) {
            window.URL.revokeObjectURL(value);
          }
        } catch (e) {
          console.error('Erreur lors de la révocation de l\'URL:', e);
        }
      });
    }
    
    console.log('Documents PDFs supprimés lors de la déconnexion');
    
    // Log out user
    await supabase.auth.signOut();
    navigate("/");
  };

  return user ? (
    <Button variant="default" onClick={handleSignOut}>
      {t('logout')}
    </Button>
  ) : (
    <Button variant="default" onClick={() => navigate("/auth")}>
      {t('login')}
    </Button>
  );
};
