
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cleanupAuthState } from "@/utils/authUtils";

export const useDeleteAccount = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const deleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Obtenir le token d'authentification actuel
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session utilisateur non trouvée");
      }
      
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
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erreur lors de la suppression du compte");
      }
      
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
      console.error("Erreur lors de la suppression du compte:", error);
      
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
