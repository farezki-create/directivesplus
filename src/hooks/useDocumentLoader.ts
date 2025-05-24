
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";

export const useDocumentLoader = (documentId: string | null) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadDocumentWithRetry = async (attempt = 0) => {
      if (!documentId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Tentative ${attempt + 1} de chargement du document:`, documentId);
        
        // Tentative 1: pdf_documents
        let { data, error } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .single();

        console.log('Résultat pdf_documents:', { data, error });

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (!data) {
          // Tentative 2: directives
          const { data: directiveData, error: directiveError } = await supabase
            .from('directives')
            .select('*')
            .eq('id', documentId)
            .single();

          console.log('Résultat directives:', { directiveData, directiveError });

          if (directiveError && directiveError.code !== 'PGRST116') {
            throw directiveError;
          }

          if (!directiveData) {
            // Tentative 3: shared_documents
            const { data: sharedData, error: sharedError } = await supabase
              .from('shared_documents')
              .select('*')
              .eq('document_id', documentId)
              .single();

            console.log('Résultat shared_documents:', { sharedData, sharedError });

            if (sharedError && sharedError.code !== 'PGRST116') {
              throw sharedError;
            }

            if (!sharedData) {
              throw new Error(`Document introuvable avec l'ID: ${documentId}`);
            }

            // Document trouvé dans shared_documents - Fix TypeScript error
            const documentData = sharedData.document_data as any;
            setDocument({
              id: sharedData.document_id,
              file_name: `Document partagé`,
              file_path: documentData?.file_path || '#',
              file_type: sharedData.document_type || 'application/pdf',
              content_type: sharedData.document_type,
              user_id: sharedData.user_id,
              created_at: sharedData.shared_at,
              description: 'Document partagé'
            });
          } else {
            // Document trouvé dans directives
            const content = directiveData.content as any;
            setDocument({
              id: directiveData.id,
              file_name: content?.title || content?.titre || 'Directive anticipée',
              file_path: `data:application/pdf;base64,${btoa('PDF directive')}`,
              file_type: 'application/json',
              content_type: 'application/json',
              user_id: directiveData.user_id,
              created_at: directiveData.created_at,
              description: 'Directive anticipée',
              content: directiveData.content
            });
          }
        } else {
          // Document trouvé dans pdf_documents
          setDocument({
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
          });
        }

        console.log("Document chargé avec succès");

      } catch (err: any) {
        console.error(`Erreur tentative ${attempt + 1}:`, err);
        
        if (attempt < 2) {
          setTimeout(() => {
            setRetryCount(attempt + 1);
            loadDocumentWithRetry(attempt + 1);
          }, 1000 * (attempt + 1));
          return;
        }
        
        setError(err.message || 'Impossible de charger le document');
      } finally {
        setLoading(false);
      }
    };

    loadDocumentWithRetry();
  }, [documentId, retryCount]);

  return {
    document,
    loading,
    error,
    retryCount,
    setRetryCount,
    setError
  };
};
