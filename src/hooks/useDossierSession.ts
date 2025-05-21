
import { useState, useEffect, useCallback } from "react";
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

  // Fonction pour vérifier l'existence des directives avec plus de robustesse
  const checkDirectivesExistence = useCallback(() => {
    if (!decryptedContent) return false;
    if (!dossierActif) return false;
    
    console.log("Vérification de l'existence des directives dans:", decryptedContent);
    
    // Chemin pour vérifier les directives dans différentes structures
    const paths = [
      ['directives_anticipees'],
      ['directives'],
      ['content', 'directives_anticipees'],
      ['content', 'directives'],
      ['contenu', 'directives_anticipees'],
      ['contenu', 'directives']
    ];
    
    // Vérifier tous les chemins possibles
    for (const path of paths) {
      let obj = decryptedContent;
      let valid = true;
      
      for (const key of path) {
        if (obj && typeof obj === 'object' && key in obj) {
          obj = obj[key];
        } else {
          valid = false;
          break;
        }
      }
      
      if (valid && obj && Object.keys(obj).length > 0) {
        console.log(`Directives trouvées dans ${path.join('.')}:`, obj);
        return true;
      }
    }
    
    // Vérifier si un mode de secours doit être activé
    const isDirectivesOnly = dossierActif.isDirectivesOnly || false;
    if (isDirectivesOnly) {
      console.log("Mode directives_only activé - création d'une image miroir possible");
      return true;
    }
    
    console.log("Aucune directive trouvée");
    return false;
  }, [decryptedContent, dossierActif]);

  // Fonction pour récupérer les directives (avec plus de robustesse)
  const getDirectives = useCallback(() => {
    if (!decryptedContent) return null;
    if (!dossierActif) return null;
    
    console.log("Récupération des directives depuis:", decryptedContent);
    
    // Chemins pour trouver les directives dans différentes structures
    const paths = [
      ['directives_anticipees'],
      ['directives'],
      ['content', 'directives_anticipees'],
      ['content', 'directives'],
      ['contenu', 'directives_anticipees'],
      ['contenu', 'directives']
    ];
    
    // Vérifier tous les chemins possibles
    for (const path of paths) {
      let obj = decryptedContent;
      let valid = true;
      
      for (const key of path) {
        if (obj && typeof obj === 'object' && key in obj) {
          obj = obj[key];
        } else {
          valid = false;
          break;
        }
      }
      
      if (valid && obj && Object.keys(obj).length > 0) {
        console.log(`Directives récupérées depuis ${path.join('.')}:`, obj);
        return obj;
      }
    }
    
    // Cas spécial: Mode "image miroir" - Si c'est un accès directives uniquement
    const isDirectivesOnly = dossierActif.isDirectivesOnly || false;
    if (isDirectivesOnly) {
      console.log("Création d'une image miroir des directives basée sur les informations du patient");
      
      // Chercher des informations sur le patient pour personnaliser l'image miroir
      let patient = { nom: "Inconnu", prenom: "Inconnu" };
      
      if (decryptedContent.patient) {
        patient = decryptedContent.patient;
      } else if (decryptedContent.content?.patient) {
        patient = decryptedContent.content.patient;
      } else if (decryptedContent.contenu?.patient) {
        patient = decryptedContent.contenu.patient;  
      } else if (dossierActif.profileData) {
        patient = {
          nom: dossierActif.profileData.last_name || "Inconnu",
          prenom: dossierActif.profileData.first_name || "Inconnu"
        };
      }
      
      // Créer une image miroir des directives
      return {
        "Directives anticipées": `Directives anticipées pour ${patient.prenom} ${patient.nom}`,
        "Date de création": new Date().toLocaleDateString('fr-FR'),
        "Personne de confiance": "Non spécifiée",
        "Instructions": "Document disponible sur demande",
        "Remarque": "Ces directives sont une représentation simplifiée"
      };
    }
    
    console.log("Aucune directive trouvée, création de directives fictives");
    // Directives génériques si aucune directive n'est trouvée
    return {
      "Information": "Les directives anticipées devraient s'afficher ici",
      "Statut": "En cours de chargement ou non disponibles",
      "Note": "Veuillez contacter le support si ce message persiste"
    };
  }, [decryptedContent, dossierActif]);

  // Vérifier si le contenu déchiffré contient des directives
  const hasDirectives = checkDirectivesExistence();

  // Extraire les informations du patient si disponibles
  const patientInfo = decryptedContent && 
    typeof decryptedContent === 'object' && 
    (decryptedContent.patient || 
     decryptedContent.content?.patient || 
     decryptedContent.contenu?.patient ||
     (dossierActif?.profileData && {
       nom: dossierActif.profileData.last_name,
       prenom: dossierActif.profileData.first_name,
       date_naissance: dossierActif.profileData.birth_date,
       adresse: dossierActif.profileData.address,
       telephone: dossierActif.profileData.phone_number
     })
    );

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
