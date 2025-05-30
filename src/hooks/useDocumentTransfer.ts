
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useDirectivesStore } from "@/store/directivesStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const { addDocument } = useDirectivesStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const updateStatus = (phase: TransferStatus['phase'], message: string, progress: number) => {
    console.log(`Transfer status update: ${phase} - ${message} (${progress}%)`);
    setTransferStatus({ phase, message, progress });
  };

  const transferToMesDirectives = async (document: TransferDocument) => {
    console.log("Starting transfer to Mes Directives");
    updateStatus('transferring', 'Transfert vers "Mes Directives" en cours...', 75);
    
    const currentUserId = user?.id || "anonymous";
    console.log("Transfer user ID:", currentUserId);
    
    if (isAuthenticated && user) {
      try {
        const documentData = {
          user_id: user.id,
          file_name: document.file_name || `Document_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}`,
          file_path: document.content ? JSON.stringify(document.content) : document.file_path,
          description: document.description || document.content?.title || "Document transféré depuis Directives Doc",
          content_type: document.content ? 'application/json' : (document.content_type || 'application/pdf'),
          external_id: `transferred-${document.id}`
        };

        console.log("Saving document to Supabase:", documentData);
        
        const { data, error } = await supabase
          .from('pdf_documents')
          .insert([documentData])
          .select()
          .single();

        if (error) {
          console.error("Erreur Supabase:", error);
          throw error;
        }

        console.log("Document sauvegardé avec succès dans Supabase:", data);
        
        updateStatus('completed', 'Document transféré avec succès !', 100);
        return data;
        
      } catch (error) {
        console.error("Erreur lors de la sauvegarde Supabase:", error);
        throw error;
      }
    } else {
      const transferredDocument = {
        id: `transferred-${document.id}-${Date.now()}`,
        file_name: document.file_name || `Document_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}`,
        file_path: document.content ? JSON.stringify(document.content) : document.file_path,
        created_at: new Date().toISOString(),
        description: document.description || document.content?.title || "Document transféré depuis Directives Doc",
        content_type: document.content ? 'application/json' : (document.content_type || 'application/pdf'),
        user_id: currentUserId,
        content: document.content
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Adding document to store:", transferredDocument.id);
      addDocument(transferredDocument);
      
      updateStatus('completed', 'Document transféré avec succès !', 100);
      return transferredDocument;
    }
  };

  const transferDocument = async (document: TransferDocument) => {
    if (isTransferring) {
      console.log("Transfer already in progress, skipping");
      return;
    }
    
    console.log("Starting document transfer process for:", document.file_name || document.id);
    console.log("Document details:", document);
    console.log("User authenticated:", isAuthenticated);
    
    try {
      setIsTransferring(true);
      updateStatus('downloading', 'Initialisation du transfert...', 25);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStatus('processing', 'Préparation du document...', 50);
      
      const transferredDocument = await transferToMesDirectives(document);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Transfer completed, redirecting to /mes-directives");
      navigate('/mes-directives');
      
      toast({
        title: "Transfert réussi",
        description: `Le document a été ajouté à vos directives`,
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
