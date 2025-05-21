
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
    // Utiliser un timeout pour éviter les problèmes de navigation pendant une mise à jour d'état
    setTimeout(() => {
      navigate('/acces-document');
    }, 100);
  }, [clearDossierActif, navigate]);

  /**
   * Redirects to access page with error message
   * @param message Error message to display
   */
  const redirectToAccessPage = useCallback((message: string) => {
    // Ne pas effacer automatiquement le dossier actif lors d'une redirection
    // pour éviter les problèmes de redirection en boucle
    
    toast({
      title: "Accès refusé",
      description: message,
      variant: "destructive"
    });
    
    // Utiliser un timeout plus long pour éviter les problèmes de navigation pendant une mise à jour d'état
    setTimeout(() => {
      navigate('/acces-document', { replace: true });
    }, 100);
  }, [navigate]);
  
  return {
    handleCloseDossier,
    redirectToAccessPage
  };
};
