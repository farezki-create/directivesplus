
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
        console.log("Starting logout cleanup for user:", user.id);
        
        // Step 1: Delete user signatures
        const { error: signatureError } = await supabase
          .from("user_signatures")
          .delete()
          .eq("user_id", user.id);
          
        if (signatureError) {
          console.error("Error deleting signatures:", signatureError);
        } else {
          console.log("User signatures deleted successfully");
        }
        
        // Step 2: Delete questionnaire synthesis
        const { error: synthesisError } = await supabase
          .from("questionnaire_synthesis")
          .delete()
          .eq("user_id", user.id);
          
        if (synthesisError) {
          console.error("Error deleting synthesis:", synthesisError);
        } else {
          console.log("Questionnaire synthesis deleted successfully");
        }
        
        // Step 3: Delete questionnaire responses
        const { error: responsesError } = await supabase
          .from("questionnaire_responses")
          .delete()
          .eq("user_id", user.id);
          
        if (responsesError) {
          console.error("Error deleting questionnaire responses:", responsesError);
        } else {
          console.log("Questionnaire responses deleted successfully");
        }
        
        // Step 4: Delete preferences responses
        const { error: preferencesError } = await supabase
          .from("questionnaire_preferences_responses")
          .delete()
          .eq("user_id", user.id);
          
        if (preferencesError) {
          console.error("Error deleting preferences responses:", preferencesError);
        } else {
          console.log("Preferences responses deleted successfully");
        }
        
        // Step 5: Delete trusted persons
        const { error: trustedPersonsError } = await supabase
          .from("trusted_persons")
          .delete()
          .eq("user_id", user.id);
          
        if (trustedPersonsError) {
          console.error("Error deleting trusted persons:", trustedPersonsError);
        } else {
          console.log("Trusted persons deleted successfully");
        }
        
        // Step 6: Delete any PDF documents from database
        const { error: pdfError } = await supabase
          .from("pdf_documents")
          .delete()
          .eq("user_id", user.id);
          
        if (pdfError) {
          console.error("Error deleting PDF documents from database:", pdfError);
        } else {
          console.log("PDF documents deleted from database successfully");
        }

        // Step 7: Delete any PDF files from storage
        try {
          // First, list all files in the user's folder
          const { data: storedFiles, error: listError } = await supabase
            .storage
            .from('directives_pdfs')
            .list(`${user.id}`);

          if (listError) {
            console.error("Error listing PDF files in storage:", listError);
          } else if (storedFiles && storedFiles.length > 0) {
            console.log(`Found ${storedFiles.length} PDF files to delete:`, storedFiles);
            
            // Delete each file
            const fileNames = storedFiles.map(file => `${user.id}/${file.name}`);
            const { data: removedData, error: removeError } = await supabase
              .storage
              .from('directives_pdfs')
              .remove(fileNames);
              
            if (removeError) {
              console.error("Error deleting PDF files from storage:", removeError);
            } else {
              console.log("PDF files removed from storage successfully:", removedData);
            }
          } else {
            console.log("No PDF files found in storage for this user");
          }
        } catch (storageError) {
          console.error("Error during storage cleanup:", storageError);
        }
        
        // Step 8: Delete directives (ensure it runs last to maintain referential integrity)
        const { error: directivesError } = await supabase
          .from("directives")
          .delete()
          .eq("user_id", user.id);
          
        if (directivesError) {
          console.error("Error deleting directives:", directivesError);
        } else {
          console.log("Directives deleted successfully");
        }
        
        // Notify user of data deletion
        toast({
          title: "Suppression des données",
          description: "Vos données ont été supprimées avec succès.",
        });
      } catch (error) {
        console.error("Error during data cleanup:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression de vos données.",
          variant: "destructive",
        });
      }
    }
    
    // Delete locally stored PDFs and other data
    try {
      console.log("Clearing local storage data");
      
      // Clear PDF data
      const pdfUrls = Object.keys(localStorage).filter(key => 
        key.startsWith('pdf_') || key.includes('dataurlstring')
      );
      
      pdfUrls.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Removed localStorage item: ${key}`);
      });
      
      // Revoke object URLs
      if (window.URL && window.URL.revokeObjectURL) {
        pdfUrls.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            if (value && value.startsWith('blob:')) {
              window.URL.revokeObjectURL(value);
              console.log(`Revoked object URL for: ${key}`);
            }
          } catch (e) {
            console.error('Error revoking object URL:', e);
          }
        });
      }
      
      // Clear any response data cached in localStorage
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('response') || 
        key.includes('directive') || 
        key.includes('synthesis') ||
        key.includes('profile')
      );
      
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Removed cached data: ${key}`);
      });
      
      console.log('Local storage cleanup completed');
    } catch (e) {
      console.error('Error during local storage cleanup:', e);
    }
    
    // Log out user and redirect
    try {
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
  };

  const navButtonClass = "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-white";

  return user ? (
    <Button variant="default" onClick={handleSignOut} className={navButtonClass}>
      {t('logout')}
    </Button>
  ) : (
    <Button variant="default" onClick={() => navigate("/auth")} className={navButtonClass}>
      {t('login')}
    </Button>
  );
};
