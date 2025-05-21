
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
  const [decryptionError, setDecryptionError] = useState<boolean>(false);
  
  // Effet pour déchiffrer et afficher les données
  useEffect(() => {
    // Rediriger vers la page d'accès si aucun dossier actif
    if (!dossierActif) {
      redirectToAccessPage("Veuillez saisir un code d'accès valide");
      return;
    }
    
    // Essayer de déchiffrer le contenu
    try {
      console.log("Traitement des données du dossier:", dossierActif.id);
      const decrypted = decryptDossierContent(dossierActif.contenu);
      setDecryptedContent(decrypted);
    } catch (error) {
      console.error("Erreur de déchiffrement pour le dossier:", dossierActif.id, error);
      setDecryptionError(true);
      toast({
        title: "Erreur de déchiffrement",
        description: "Impossible de déchiffrer les données du dossier",
        variant: "destructive"
      });
    }
  }, [dossierActif, redirectToAccessPage]);

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
    handleCloseDossier
  };
};
