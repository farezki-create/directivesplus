
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
      
      console.log('🗑️ [DELETE-ACCOUNT] Starting account deletion process');
      
      // Obtenir le token d'authentification actuel
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session utilisateur non trouvée");
      }
      
      console.log('🔑 [DELETE-ACCOUNT] Session found, calling deletion endpoint');
      
      // Appeler la edge function qui va gérer la suppression des données
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
      
      console.log('📡 [DELETE-ACCOUNT] Response status:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('📄 [DELETE-ACCOUNT] Response data:', responseData);
      } catch (parseError) {
        console.error('❌ [DELETE-ACCOUNT] Failed to parse response:', parseError);
        throw new Error("Erreur de communication avec le serveur");
      }
      
      if (!response.ok) {
        console.error('❌ [DELETE-ACCOUNT] HTTP error:', response.status, responseData);
        
        // Gestion spécifique des erreurs HTTP
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
        console.error('❌ [DELETE-ACCOUNT] Operation failed:', responseData);
        throw new Error(responseData?.error || responseData?.details || "La suppression du compte a échoué");
      }
      
      console.log('✅ [DELETE-ACCOUNT] Account deletion successful');
      
      // Nettoyer l'état d'authentification
      cleanupAuthState();
      
      // Afficher un message de succès
      toast({
        title: "Compte supprimé",
        description: "Votre compte et toutes vos données ont été supprimés avec succès.",
      });
      
      // Rediriger vers la page d'accueil
      navigate("/");
      
    } catch (error: any) {
      console.error('❌ [DELETE-ACCOUNT] Error during deletion:', error);
      
      // Utiliser le gestionnaire d'erreur centralisé
      await handleError(error, 'deleteAccount', error.message);
      
      // Toast d'erreur plus spécifique
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
