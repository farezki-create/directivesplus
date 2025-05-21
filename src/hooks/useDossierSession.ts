
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
    // Si déjà initialisé, ne pas refaire le traitement
    if (sessionInitialized) {
      return;
    }
    
    // Mettre un délai pour permettre au dossier d'être chargé
    const timer = setTimeout(() => {
      // Vérifier si un dossier est actif
      if (!dossierActif) {
        console.log("Aucun dossier actif trouvé, redirection vers la page d'accès");
        redirectToAccessPage("Veuillez saisir un code d'accès valide");
        return;
      }
      
      setSessionInitialized(true);
      setLoading(true);
      
      try {
        console.log("Traitement des données du dossier:", dossierActif.id);
        console.log("Type d'accès:", dossierActif.isDirectivesOnly ? "Directives seulement" : 
                              dossierActif.isMedicalOnly ? "Médical seulement" : "Complet");
        
        // Vérifier si contenu est undefined ou null
        if (!dossierActif.contenu) {
          throw new Error("Le contenu du dossier est vide ou manquant");
        }
        
        const decrypted = decryptDossierContent(dossierActif.contenu);
        setDecryptedContent(decrypted);
        setDecryptionError(null);
        
        // Définir correctement l'onglet actif en fonction du type d'accès
        if (dossierActif.isDirectivesOnly) {
          console.log("Configuration de l'onglet actif: directives");
          setActiveTab("directives");
        } else if (dossierActif.isMedicalOnly) {
          console.log("Configuration de l'onglet actif: medical");
          setActiveTab("medical");
        }
        
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
    }, 800); // Délai pour s'assurer que le dossier est chargé
    
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

  // Vérifier si l'utilisateur a accès aux directives
  const canAccessDirectives = dossierActif ? 
    !dossierActif.isMedicalOnly : false;

  // Vérifier si l'utilisateur a accès aux données médicales
  const canAccessMedical = dossierActif ? 
    !dossierActif.isDirectivesOnly : false;

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
    setActiveTab,
    canAccessDirectives,
    canAccessMedical
  };
};
