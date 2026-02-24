
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";

export const useDocumentLoader = (documentId: string | null) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadDocument = async (id: string, attempt: number = 0) => {
    if (!id) {
      console.error("🚫 useDocumentLoader: ID du document manquant");
      setError("ID du document manquant");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: rpcDoc, error: rpcError } = await supabase
        .rpc('get_public_document', { doc_id: id });

      if (rpcDoc && rpcDoc.length > 0 && !rpcError) {
        const doc = rpcDoc[0];
        const transformedDoc: Document = {
          id: doc.id,
          file_name: doc.file_name,
          file_path: doc.file_path,
          content_type: doc.content_type || 'application/pdf',
          file_type: doc.content_type?.split('/')[1] || 'pdf',
          user_id: doc.user_id,
          created_at: doc.created_at,
          description: doc.description,
          file_size: doc.file_size,
          updated_at: doc.updated_at,
          external_id: doc.external_id
        };
        
        setDocument(transformedDoc);
        setLoading(false);
        return;
      }

      // If RPC returned empty (access denied or not found), try direct query (RLS will enforce ownership)
      if (!rpcError || (rpcDoc && rpcDoc.length === 0)) {
        const { data: directDoc, error: directError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (directDoc && !directError) {
          const transformedDoc: Document = {
            ...directDoc,
            file_type: directDoc.content_type?.split('/')[1] || 'pdf',
            content_type: directDoc.content_type || 'application/pdf'
          };
          setDocument(transformedDoc);
          setLoading(false);
          return;
        }
      }

      const finalError = `Document ${id} introuvable`;
      console.error("❌ ÉCHEC COMPLET:", finalError);
      throw new Error(finalError);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(`❌ useDocumentLoader: ERREUR tentative ${attempt + 1}:`, errorMessage);
      
      if (attempt < 2) {
        const retryDelay = 1000 * (attempt + 1);
        setTimeout(() => {
          setRetryCount(attempt + 1);
          loadDocument(id, attempt + 1);
        }, retryDelay);
        return;
      }

      console.error("🚫 ABANDON: Maximum de tentatives atteint");
      setError(errorMessage);
      setDocument(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      setRetryCount(0);
      loadDocument(documentId);
    } else {
      setDocument(null);
      setLoading(false);
      setError(null);
    }
  }, [documentId]);

  const retryLoad = () => {
    if (documentId && retryCount < 3) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      loadDocument(documentId, newRetryCount);
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
