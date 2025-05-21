
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";

/**
 * Hook to manage dossier navigation and session actions
 */
export const useDossierNavigation = () => {
  const navigate = useNavigate();
  const { clearDossierActif } = useDossierStore();
  
  /**
   * Closes the current dossier and navigates to access page
   */
  const handleCloseDossier = useCallback(() => {
    clearDossierActif();
    toast({
      title: "Dossier fermé",
      description: "Le dossier médical a été fermé avec succès"
    });
    navigate('/acces-document');
  }, [clearDossierActif, navigate]);

  /**
   * Redirects to access page with error message
   * @param message Error message to display
   */
  const redirectToAccessPage = useCallback((message: string) => {
    toast({
      title: "Accès refusé",
      description: message,
      variant: "destructive"
    });
    navigate('/acces-document');
  }, [navigate]);
  
  return {
    handleCloseDossier,
    redirectToAccessPage
  };
};
