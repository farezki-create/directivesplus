
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
        const { data: pdfData, error: pdfError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .maybeSingle();

        if (abortController.signal.aborted) {
          return;
        }

        console.log('useDocumentLoader: Résultat pdf_documents:', { data: pdfData, error: pdfError });

        if (pdfError) {
          console.error("useDocumentLoader: Erreur dans pdf_documents:", pdfError);
          throw pdfError;
        }

        if (pdfData) {
          console.log("useDocumentLoader: Document trouvé dans pdf_documents");
          const newDocument = {
            id: pdfData.id,
            file_name: pdfData.file_name,
            file_path: pdfData.file_path,
            file_type: pdfData.content_type || 'application/pdf',
            content_type: pdfData.content_type,
            user_id: pdfData.user_id,
            created_at: pdfData.created_at,
            description: pdfData.description,
            file_size: pdfData.file_size,
            updated_at: pdfData.updated_at,
            external_id: pdfData.external_id
          };
          console.log("useDocumentLoader: Document final (pdf):", newDocument);
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
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

        console.log('useDocumentLoader: Résultat directives:', { data: directiveData, error: directiveError });

        if (directiveError) {
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
          setLoading(false);
          loadingRef.current = false;
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

        console.log('useDocumentLoader: Résultat shared_documents:', { data: sharedData, error: sharedError });

        if (sharedError) {
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
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        // Aucun document trouvé
        const errorMsg = `Document avec l'ID ${documentId} introuvable. Vérifiez que l'ID est correct et que vous avez les permissions d'accès.`;
        console.error("useDocumentLoader:", errorMsg);
        throw new Error(errorMsg);

      } catch (err: any) {
        if (abortController.signal.aborted) {
          console.log("useDocumentLoader: Requête annulée");
          return;
        }

        console.error(`useDocumentLoader: Erreur tentative ${attempt + 1}:`, err);
        
        // Plus de tentatives automatiques - nous savons que le document existe
        const errorMessage = err.message || 'Impossible de charger le document';
        console.error("useDocumentLoader: Erreur finale:", errorMessage);
        setError(errorMessage);
        setLoading(false);
        loadingRef.current = false;
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
  }, [documentId, retryCount]); // Ajouter retryCount comme dépendance

  // Fonction manuelle de retry
  const retryLoad = () => {
    if (!loadingRef.current) {
      console.log("useDocumentLoader: Retry manuel déclenché");
      setRetryCount(prev => prev + 1);
      setError(null);
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
