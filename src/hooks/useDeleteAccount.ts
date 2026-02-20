
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cleanupAuthState } from "@/utils/authUtils";
import { useErrorHandler } from "./useErrorHandler";

export const useDeleteAccount = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { handleError } = useErrorHandler({ component: 'useDeleteAccount' });

  const deleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session utilisateur non trouvée");
      }
      
      const response = await fetch(
        "https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/deleteUserAccount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
        }
      );
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error("Erreur de communication avec le serveur");
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        } else if (response.status === 403) {
          throw new Error("Accès non autorisé pour cette opération.");
        } else if (response.status >= 500) {
          throw new Error("Erreur serveur temporaire. Veuillez réessayer plus tard.");
        } else {
          throw new Error(responseData?.error || responseData?.details || `Erreur HTTP ${response.status}`);
        }
      }
      
      if (!responseData?.success) {
        throw new Error(responseData?.error || responseData?.details || "La suppression du compte a échoué");
      }
      
      cleanupAuthState();
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte et toutes vos données ont été supprimés avec succès.",
      });
      
      navigate("/");
      
    } catch (error: any) {
      console.error('Error during deletion:', error);
      
      await handleError(error, 'deleteAccount', error.message);
      
      toast({
        title: "Erreur lors de la suppression",
        description: error.message || "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
      
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteAccount
  };
};
