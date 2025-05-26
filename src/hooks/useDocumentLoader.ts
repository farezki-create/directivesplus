
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
      setError("ID du document manquant");
      setLoading(false);
      return;
    }

    console.log(`useDocumentLoader: Tentative ${attempt + 1} pour charger le document ${id}`);
    
    try {
      setLoading(true);
      setError(null);

      // Utiliser la fonction publique pour accéder au document
      // Cette fonction contourne les politiques RLS pour l'accès public
      const { data: pdfDoc, error: pdfError } = await supabase
        .rpc('get_public_document', { doc_id: id });

      if (pdfDoc && pdfDoc.length > 0 && !pdfError) {
        console.log("Document trouvé via get_public_document:", pdfDoc[0]);
        const doc = pdfDoc[0];
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

      // Si la fonction RPC échoue, essayer l'accès direct (pour les utilisateurs authentifiés)
      const { data: directDoc, error: directError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (directDoc && !directError) {
        console.log("Document trouvé via accès direct:", directDoc);
        const transformedDoc: Document = {
          ...directDoc,
          file_type: directDoc.content_type?.split('/')[1] || 'pdf',
          content_type: directDoc.content_type || 'application/pdf'
        };
        setDocument(transformedDoc);
        setLoading(false);
        return;
      }

      // Essayer ensuite dans medical_documents
      const { data: medicalDoc, error: medicalError } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (medicalDoc && !medicalError) {
        console.log("Document trouvé dans medical_documents:", medicalDoc);
        const transformedDoc: Document = {
          ...medicalDoc,
          content_type: `application/${medicalDoc.file_type}`
        };
        setDocument(transformedDoc);
        setLoading(false);
        return;
      }

      // Si aucun document trouvé
      if (pdfError || directError || medicalError) {
        console.error("Erreurs de requête:", { pdfError, directError, medicalError });
        throw new Error("Erreur lors de la récupération du document");
      }

      throw new Error("Document non trouvé");

    } catch (err) {
      console.error(`useDocumentLoader: Erreur tentative ${attempt + 1}:`, err);
      
      if (attempt < 2) {
        // Retry automatique
        setTimeout(() => {
          loadDocument(id, attempt + 1);
        }, 1000 * (attempt + 1));
        return;
      }

      setError(err instanceof Error ? err.message : "Erreur inconnue");
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
