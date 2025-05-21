
import { useState, useEffect, useCallback } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";
import { useDossierNavigation } from "@/hooks/dossier/useDossierNavigation";
import { decryptDossierContent } from "@/utils/dossier/contentDecrypt";
import { 
  checkDirectivesExistence,
  getDirectivesFromContent,
  extractPatientInfo
} from "@/utils/directives/directivesUtils";

/**
 * Hook pour gérer les données de session du dossier médical
 */
export const useDossierSession = () => {
  const { dossierActif } = useDossierStore();
  const { handleCloseDossier, redirectToAccessPage } = useDossierNavigation();
  const [decryptedContent, setDecryptedContent] = useState<any>(null);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("directives");
  const [sessionInitialized, setSessionInitialized] = useState<boolean>(false);
  
  // Effet pour déchiffrer et afficher les données
  useEffect(() => {
    // Mettre un petit délai pour permettre au dossier d'être chargé
    const timer = setTimeout(() => {
      // Ne traiter que si le hook n'a pas encore été initialisé ou si le dossier a changé
      if (sessionInitialized && !dossierActif) {
        // Ne pas rediriger si déjà initialisé mais pas de dossier actif
        // Cela évite les redirections en boucle
        setLoading(false);
        return;
      }
      
      // Rediriger vers la page d'accès si aucun dossier actif
      if (!dossierActif) {
        console.log("Aucun dossier actif trouvé, redirection vers la page d'accès");
        redirectToAccessPage("Veuillez saisir un code d'accès valide");
        return;
      }
      
      setSessionInitialized(true);
      setLoading(true);
      
      // Essayer de déchiffrer le contenu
      try {
        console.log("Traitement des données du dossier:", dossierActif.id);
        const decrypted = decryptDossierContent(dossierActif.contenu);
        setDecryptedContent(decrypted);
        setDecryptionError(null);
      } catch (error: any) {
        console.error("Erreur de déchiffrement pour le dossier:", dossierActif.id, error);
        setDecryptionError(error.message || "Erreur de déchiffrement");
        toast({
          title: "Erreur de déchiffrement",
          description: "Impossible de déchiffrer les données du dossier",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }, 300); // Augmenter le délai pour s'assurer que le dossier est chargé
    
    return () => clearTimeout(timer);
  }, [dossierActif, redirectToAccessPage, sessionInitialized]);

  // Vérifier l'existence des directives
  const hasDirectives = useCallback(() => {
    return checkDirectivesExistence(decryptedContent, dossierActif);
  }, [decryptedContent, dossierActif]);

  // Récupérer les directives
  const getDirectives = useCallback(() => {
    return getDirectivesFromContent(decryptedContent, dossierActif);
  }, [decryptedContent, dossierActif]);

  // Extraire les informations du patient
  const patientInfo = decryptedContent ? 
    extractPatientInfo(decryptedContent, dossierActif) : null;

  return {
    dossierActif,
    decryptedContent,
    decryptionError,
    hasDirectives: hasDirectives(),
    getDirectives,
    patientInfo,
    handleCloseDossier,
    loading,
    activeTab,
    setActiveTab
  };
};
