
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";
import { decryptData } from "@/utils/encryption";
import { useDossierSecurity } from "@/hooks/useDossierSecurity";

/**
 * Hook for managing dossier session data, including:
 * - Data decryption
 * - Content extraction
 * - Session management
 */
export const useDossierSession = () => {
  const { dossierActif, clearDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const [decryptedContent, setDecryptedContent] = useState<any>(null);
  const [decryptionError, setDecryptionError] = useState<boolean>(false);
  
  // Handle dossier closure and navigation
  const handleCloseDossier = () => {
    clearDossierActif();
    toast({
      title: "Dossier fermé",
      description: "Le dossier médical a été fermé avec succès"
    });
    navigate('/acces-document');
  };
  
  // Use the security hook
  const { logDossierEvent } = useDossierSecurity(
    dossierActif?.id,
    handleCloseDossier
  );
  
  // Effect to decrypt and display data
  useEffect(() => {
    // Redirect to access page if no active dossier
    if (!dossierActif) {
      toast({
        title: "Accès refusé",
        description: "Veuillez saisir un code d'accès valide",
        variant: "destructive"
      });
      navigate('/acces-document');
    } else {
      // Try to decrypt content
      try {
        // Check if content is encrypted (starts with "U2F")
        if (typeof dossierActif.contenu === 'string' && dossierActif.contenu.startsWith('U2F')) {
          const decrypted = decryptData(dossierActif.contenu);
          setDecryptedContent(decrypted);
          console.log("Données déchiffrées avec succès");
        } else {
          // If data is not encrypted (backward compatibility)
          setDecryptedContent(dossierActif.contenu);
          console.log("Données non chiffrées utilisées directement");
        }

        // Log the dossier view
        logDossierEvent("view", true);
      } catch (error) {
        console.error("Erreur de déchiffrement:", error);
        setDecryptionError(true);
        toast({
          title: "Erreur de déchiffrement",
          description: "Impossible de déchiffrer les données du dossier",
          variant: "destructive"
        });

        // Log the decryption error
        logDossierEvent("attempt", false);
      }
    }
  }, [dossierActif, navigate, logDossierEvent]);

  // Check if the decrypted content contains directives
  const hasDirectives = decryptedContent && 
    typeof decryptedContent === 'object' && 
    decryptedContent.directives_anticipees;

  // Extract patient info if available
  const patientInfo = decryptedContent && 
    typeof decryptedContent === 'object' && 
    decryptedContent.patient;

  return {
    dossierActif,
    decryptedContent,
    decryptionError,
    hasDirectives,
    patientInfo,
    handleCloseDossier
  };
};
