
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export interface TransferDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  file_type?: string;
  user_id?: string;
  is_private?: boolean;
  content?: any;
}

export interface TransferStatus {
  phase: 'idle' | 'downloading' | 'processing' | 'transferring' | 'completed' | 'error';
  message: string;
  progress: number;
}

export const useDocumentTransfer = () => {
  const [transferStatus, setTransferStatus] = useState<TransferStatus>({
    phase: 'idle',
    message: '',
    progress: 0
  });
  const [isTransferring, setIsTransferring] = useState(false);
  const { dossierActif, setDossierActif } = useDossierStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const updateStatus = (phase: TransferStatus['phase'], message: string, progress: number) => {
    console.log(`Transfer status update: ${phase} - ${message} (${progress}%)`);
    setTransferStatus({ phase, message, progress });
  };

  const downloadDocumentToClipboard = async (document: TransferDocument): Promise<Blob> => {
    console.log("Starting document download for:", document.file_name);
    updateStatus('downloading', 'Téléchargement du document en cours...', 25);
    
    // Simuler le téléchargement avec un délai réaliste
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let documentBlob: Blob;
    
    if (document.content) {
      console.log("Processing directive content");
      // Si c'est une directive avec du contenu structuré
      const documentContent = {
        title: document.content.title || 'Directive Anticipée',
        content: document.content,
        created_at: document.created_at,
        type: 'directive'
      };
      
      // Créer un document PDF simulé
      const jsonContent = JSON.stringify(documentContent, null, 2);
      documentBlob = new Blob([jsonContent], { type: 'application/json' });
    } else {
      console.log("Processing regular document file");
      // Pour les autres types de documents
      try {
        if (document.file_path && document.file_path.startsWith('data:')) {
          // Décoder le base64
          const base64Data = document.file_path.split(',')[1];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          documentBlob = new Blob([bytes], { type: document.content_type || 'application/pdf' });
        } else {
          // Créer un document de substitution
          const substituteContent = `Document: ${document.file_name || 'Document sans nom'}\nCréé le: ${document.created_at}\nDescription: ${document.description || 'Aucune description'}`;
          documentBlob = new Blob([substituteContent], { type: 'text/plain' });
        }
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
        // Créer un document de fallback
        const fallbackContent = `Document: ${document.file_name || 'Document'}\nErreur de récupération: ${error}`;
        documentBlob = new Blob([fallbackContent], { type: 'text/plain' });
      }
    }
    
    console.log("Document downloaded successfully, size:", documentBlob.size);
    updateStatus('processing', 'Document téléchargé, préparation du transfert...', 50);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return documentBlob;
  };

  const transferToMesDirectives = async (document: TransferDocument, documentBlob: Blob) => {
    console.log("Starting transfer to Mes Directives");
    updateStatus('transferring', 'Transfert vers "Mes Directives" en cours...', 75);
    
    // Déterminer l'utilisateur - soit authentifié soit anonyme
    const currentUserId = user?.id || "anonymous";
    console.log("Transfer user ID:", currentUserId);
    
    // Créer un document virtuel compatible avec le système
    const transferredDocument = {
      id: `transferred-${document.id}-${Date.now()}`,
      file_name: document.file_name || `Document_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`,
      file_path: `data:${document.content_type || 'application/pdf'};base64,${await blobToBase64(documentBlob)}`,
      created_at: new Date().toISOString(),
      description: document.description || document.content?.title || "Document transféré depuis Directives Doc",
      content_type: document.content_type || 'application/pdf',
      is_shared: true,
      user_id: currentUserId,
      original_directive: document.content ? document : undefined
    };

    // Créer le profil utilisateur
    const profileData = isAuthenticated && user ? {
      first_name: user?.user_metadata?.first_name || "Utilisateur",
      last_name: user?.user_metadata?.last_name || "Connecté",
      birth_date: user?.user_metadata?.birth_date || null,
    } : {
      first_name: "Accès",
      last_name: "Public",
      birth_date: null,
    };

    console.log("Creating dossier with profile:", profileData);

    // Préparer le nouveau dossier ou mettre à jour l'existant
    let updatedDossier;
    
    if (dossierActif) {
      // Ajouter le document au dossier existant
      console.log("Adding document to existing dossier:", dossierActif.id);
      const existingDocuments = dossierActif.contenu?.documents || [];
      updatedDossier = {
        ...dossierActif,
        contenu: {
          ...dossierActif.contenu,
          documents: [...existingDocuments, transferredDocument]
        }
      };
    } else {
      // Créer un nouveau dossier
      console.log("Creating new dossier");
      updatedDossier = {
        id: `transferred-dossier-${Date.now()}`,
        userId: currentUserId,
        isFullAccess: true,
        isDirectivesOnly: true,
        isMedicalOnly: false,
        profileData: profileData,
        contenu: {
          patient: {
            nom: profileData.last_name,
            prenom: profileData.first_name,
            date_naissance: profileData.birth_date || null,
          },
          documents: [transferredDocument]
        }
      };
    }

    // Simuler le temps de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Setting dossier actif:", updatedDossier.id);
    console.log("Documents in dossier:", updatedDossier.contenu.documents?.length);
    
    // Stocker le dossier dans le store
    setDossierActif(updatedDossier);
    
    // Marquer le document comme ajouté pour le toast
    sessionStorage.setItem('documentAdded', JSON.stringify({
      fileName: transferredDocument.file_name,
      timestamp: Date.now()
    }));
    
    console.log("Document marked as added in sessionStorage");
    updateStatus('completed', 'Document transféré avec succès !', 100);
    
    return transferredDocument;
  };

  const transferDocument = async (document: TransferDocument) => {
    if (isTransferring) {
      console.log("Transfer already in progress, skipping");
      return;
    }
    
    console.log("Starting document transfer process for:", document.file_name || document.id);
    console.log("Document details:", document);
    
    try {
      setIsTransferring(true);
      updateStatus('downloading', 'Initialisation du transfert...', 0);
      
      // Phase 1: Téléchargement
      const documentBlob = await downloadDocumentToClipboard(document);
      
      // Phase 2: Transfert
      const transferredDocument = await transferToMesDirectives(document, documentBlob);
      
      // Attendre un moment pour montrer le succès
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Transfer completed, redirecting to /mes-directives");
      // Rediriger vers mes-directives
      navigate('/mes-directives');
      
      toast({
        title: "Transfert réussi",
        description: `${transferredDocument.file_name} a été ajouté à vos directives`,
      });
      
    } catch (error: any) {
      console.error("Erreur lors du transfert:", error);
      updateStatus('error', `Erreur: ${error.message}`, 0);
      
      toast({
        title: "Erreur de transfert",
        description: "Une erreur s'est produite lors du transfert du document",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setTransferStatus({ phase: 'idle', message: '', progress: 0 });
      }, 3000);
    }
  };

  return {
    transferDocument,
    transferStatus,
    isTransferring
  };
};

// Fonction utilitaire pour convertir Blob en base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Retourner seulement la partie base64
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
