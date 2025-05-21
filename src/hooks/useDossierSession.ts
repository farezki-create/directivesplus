
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";
import { decryptData } from "@/utils/encryption";

/**
 * Hook pour gérer les données de session du dossier médical, incluant:
 * - Le déchiffrement des données
 * - L'extraction du contenu
 * - La gestion de la session
 */
export const useDossierSession = () => {
  const { dossierActif, clearDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const [decryptedContent, setDecryptedContent] = useState<any>(null);
  const [decryptionError, setDecryptionError] = useState<boolean>(false);
  
  // Fonction pour fermer le dossier et naviguer
  const handleCloseDossier = () => {
    clearDossierActif();
    toast({
      title: "Dossier fermé",
      description: "Le dossier médical a été fermé avec succès"
    });
    navigate('/acces-document');
  };
  
  // Effet pour déchiffrer et afficher les données
  useEffect(() => {
    // Rediriger vers la page d'accès si aucun dossier actif
    if (!dossierActif) {
      toast({
        title: "Accès refusé",
        description: "Veuillez saisir un code d'accès valide",
        variant: "destructive"
      });
      navigate('/acces-document');
      return;
    }
    
    // Essayer de déchiffrer le contenu
    try {
      console.log("Traitement des données du dossier:", dossierActif.id);
      console.log("Contenu du dossier:", dossierActif.contenu);
      
      // Vérifier si le contenu est chiffré (commence par "U2F")
      if (typeof dossierActif.contenu === 'string' && dossierActif.contenu.startsWith('U2F')) {
        const decrypted = decryptData(dossierActif.contenu);
        setDecryptedContent(decrypted);
        console.log("Données déchiffrées avec succès pour le dossier:", dossierActif.id);
      } else {
        // Si les données ne sont pas chiffrées (compatibilité descendante)
        setDecryptedContent(dossierActif.contenu);
        console.log("Données non chiffrées utilisées directement pour le dossier:", dossierActif.id);
      }
    } catch (error) {
      console.error("Erreur de déchiffrement pour le dossier:", dossierActif.id, error);
      setDecryptionError(true);
      toast({
        title: "Erreur de déchiffrement",
        description: "Impossible de déchiffrer les données du dossier",
        variant: "destructive"
      });
    }
  }, [dossierActif, navigate]);

  // Vérifier si le contenu déchiffré contient des directives
  // Amélioration de la détection des directives anticipées
  const hasDirectives = !!decryptedContent && 
    typeof decryptedContent === 'object' && 
    (decryptedContent.directives_anticipees !== undefined || 
     (decryptedContent.directives && decryptedContent.directives.length > 0));

  // Récupérer les directives anticipées (avec compatibilité pour différentes structures)
  const getDirectives = () => {
    if (!decryptedContent) return null;
    
    if (decryptedContent.directives_anticipees) {
      return decryptedContent.directives_anticipees;
    } 
    
    if (decryptedContent.directives) {
      return decryptedContent.directives;
    }
    
    return null;
  };

  // Extraire les informations du patient si disponibles
  const patientInfo = decryptedContent && 
    typeof decryptedContent === 'object' && 
    decryptedContent.patient;

  return {
    dossierActif,
    decryptedContent,
    decryptionError,
    hasDirectives,
    getDirectives,
    patientInfo,
    handleCloseDossier
  };
};
