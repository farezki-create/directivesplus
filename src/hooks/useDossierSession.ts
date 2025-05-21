
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";
import { decryptData } from "@/utils/encryption";
import { logAccessEvent } from "@/utils/accessLoggingUtils";

export const useDossierSession = () => {
  const { dossierActif, clearDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const [decryptedContent, setDecryptedContent] = useState<any>(null);
  const [decryptionError, setDecryptionError] = useState<boolean>(false);
  
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
        logAccessEvent({
          userId: '00000000-0000-0000-0000-000000000000', // Anonymous user
          accessCodeId: dossierActif.id,
          resourceType: "dossier",
          resourceId: dossierActif.id,
          action: "view",
          success: true
        });
      } catch (error) {
        console.error("Erreur de déchiffrement:", error);
        setDecryptionError(true);
        toast({
          title: "Erreur de déchiffrement",
          description: "Impossible de déchiffrer les données du dossier",
          variant: "destructive"
        });

        // Log the decryption error
        logAccessEvent({
          userId: '00000000-0000-0000-0000-000000000000',
          accessCodeId: dossierActif.id,
          resourceType: "dossier",
          resourceId: dossierActif.id,
          action: "attempt",
          success: false
        });
      }
    }
  }, [dossierActif, navigate]);

  // Effects for session security management
  useEffect(() => {
    // Set inactivity timeout
    const inactivityTimeout = setTimeout(() => {
      if (dossierActif) {
        toast({
          title: "Session expirée",
          description: "Votre session a expiré pour des raisons de sécurité",
          variant: "default"
        });
        handleCloseDossier();
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    // Listen for user events to reset inactivity timeout
    const resetTimeout = () => {
      clearTimeout(inactivityTimeout);
    };
    
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    
    // Cleanup on component destruction
    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
    };
  }, [dossierActif]);

  const handleCloseDossier = () => {
    // Log the dossier closure if available
    if (dossierActif) {
      logAccessEvent({
        userId: '00000000-0000-0000-0000-000000000000',
        accessCodeId: dossierActif.id,
        resourceType: "dossier",
        resourceId: dossierActif.id,
        action: "access",
        success: true
      });
    }
    
    clearDossierActif();
    toast({
      title: "Dossier fermé",
      description: "Le dossier médical a été fermé avec succès"
    });
    navigate('/acces-document');
  };

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
