
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { cleanupAuthState } from "@/utils/authUtils";

export const useProfileLogout = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      toast.success("Déconnexion réussie");
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  }, []);

  return {
    handleLogout
  };
};
