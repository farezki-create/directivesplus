
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";

export const useDocumentLoader = (documentId: string | null) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const loadDocumentWithRetry = async (attempt = 0) => {
      if (!documentId) {
        console.log("useDocumentLoader: Aucun documentId fourni");
        setLoading(false);
        return;
      }

      // Éviter les chargements multiples simultanés
      if (loadingRef.current) {
        console.log("useDocumentLoader: Chargement déjà en cours, annulation");
        return;
      }

      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Créer un nouveau controller pour cette requête
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      loadingRef.current = true;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log(`useDocumentLoader: Tentative ${attempt + 1} de chargement du document:`, documentId);

        // Vérifier si la requête a été annulée
        if (abortController.signal.aborted) {
          return;
        }
        
        // Tentative 1: pdf_documents
        console.log("useDocumentLoader: Recherche dans pdf_documents...");
        let { data, error } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .maybeSingle();

        if (abortController.signal.aborted) {
          return;
        }

        console.log('useDocumentLoader: Résultat pdf_documents:', { data, error, errorCode: error?.code });

        if (error && error.code !== 'PGRST116') {
          console.error("useDocumentLoader: Erreur dans pdf_documents:", error);
          throw error;
        }

        if (data) {
          console.log("useDocumentLoader: Document trouvé dans pdf_documents");
          const newDocument = {
            id: data.id,
            file_name: data.file_name,
            file_path: data.file_path,
            file_type: data.content_type || 'application/pdf',
            content_type: data.content_type,
            user_id: data.user_id,
            created_at: data.created_at,
            description: data.description,
            file_size: data.file_size,
            updated_at: data.updated_at,
            external_id: data.external_id
          };
          console.log("useDocumentLoader: Document final (pdf):", newDocument);
          setDocument(newDocument);
          return;
        }

        // Tentative 2: directives
        console.log("useDocumentLoader: Recherche dans directives...");
        const { data: directiveData, error: directiveError } = await supabase
          .from('directives')
          .select('*')
          .eq('id', documentId)
          .maybeSingle();

        if (abortController.signal.aborted) {
          return;
        }

        console.log('useDocumentLoader: Résultat directives:', { directiveData, directiveError, errorCode: directiveError?.code });

        if (directiveError && directiveError.code !== 'PGRST116') {
          console.error("useDocumentLoader: Erreur dans directives:", directiveError);
          throw directiveError;
        }

        if (directiveData) {
          console.log("useDocumentLoader: Document trouvé dans directives");
          const content = directiveData.content as any;
          const newDocument = {
            id: directiveData.id,
            file_name: content?.title || content?.titre || 'Directive anticipée',
            file_path: `data:application/pdf;base64,${btoa('PDF directive')}`,
            file_type: 'application/json',
            content_type: 'application/json',
            user_id: directiveData.user_id,
            created_at: directiveData.created_at,
            description: 'Directive anticipée',
            content: directiveData.content
          };
          console.log("useDocumentLoader: Document final (directive):", newDocument);
          setDocument(newDocument);
          return;
        }

        // Tentative 3: shared_documents
        console.log("useDocumentLoader: Recherche dans shared_documents...");
        const { data: sharedData, error: sharedError } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('document_id', documentId)
          .maybeSingle();

        if (abortController.signal.aborted) {
          return;
        }

        console.log('useDocumentLoader: Résultat shared_documents:', { sharedData, sharedError, errorCode: sharedError?.code });

        if (sharedError && sharedError.code !== 'PGRST116') {
          console.error("useDocumentLoader: Erreur dans shared_documents:", sharedError);
          throw sharedError;
        }

        if (sharedData) {
          console.log("useDocumentLoader: Document trouvé dans shared_documents");
          const documentData = sharedData.document_data as any;
          const newDocument = {
            id: sharedData.document_id,
            file_name: `Document partagé`,
            file_path: documentData?.file_path || '#',
            file_type: sharedData.document_type || 'application/pdf',
            content_type: sharedData.document_type,
            user_id: sharedData.user_id,
            created_at: sharedData.shared_at,
            description: 'Document partagé'
          };
          console.log("useDocumentLoader: Document final (shared):", newDocument);
          setDocument(newDocument);
          return;
        }

        // Vérification finale: le document existe-t-il vraiment ?
        console.log("useDocumentLoader: Vérification de l'existence du document ID:", documentId);
        
        // Aucun document trouvé - créer un message d'erreur détaillé
        const errorMsg = attempt === 0 
          ? `Document avec l'ID ${documentId} introuvable. Vérifiez que l'ID est correct et que vous avez les permissions d'accès.`
          : `Document introuvable avec l'ID: ${documentId}`;
        
        console.error("useDocumentLoader:", errorMsg);
        throw new Error(errorMsg);

      } catch (err: any) {
        if (abortController.signal.aborted) {
          console.log("useDocumentLoader: Requête annulée");
          return;
        }

        console.error(`useDocumentLoader: Erreur tentative ${attempt + 1}:`, err);
        
        // Ne plus faire de tentatives multiples automatiques
        if (attempt === 0 && !err.message?.includes('introuvable')) {
          const delay = 1000;
          console.log(`useDocumentLoader: Nouvelle tentative dans ${delay}ms...`);
          setTimeout(() => {
            if (!abortController.signal.aborted) {
              setRetryCount(attempt + 1);
              loadDocumentWithRetry(attempt + 1);
            }
          }, delay);
          return;
        }
        
        const errorMessage = err.message || 'Impossible de charger le document';
        console.error("useDocumentLoader: Erreur finale:", errorMessage);
        setError(errorMessage);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };

    loadDocumentWithRetry();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      loadingRef.current = false;
    };
  }, [documentId]); // Retirer retryCount des dépendances pour éviter les boucles

  // Fonction manuelle de retry
  const retryLoad = () => {
    if (!loadingRef.current) {
      setRetryCount(prev => prev + 1);
      setError(null);
      // Relancer le useEffect en changeant une dépendance
      setDocument(null);
    }
  };

  return {
    document,
    loading,
    error,
    retryCount,
    retryLoad,
    setError
  };
};
