
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

      // Essayer d'abord dans pdf_documents
      const { data: pdfDoc, error: pdfError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (pdfDoc && !pdfError) {
        console.log("Document trouvé dans pdf_documents:", pdfDoc);
        const transformedDoc: Document = {
          ...pdfDoc,
          file_type: pdfDoc.content_type?.split('/')[1] || 'pdf',
          content_type: pdfDoc.content_type || 'application/pdf'
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
      if (pdfError || medicalError) {
        console.error("Erreurs de requête:", { pdfError, medicalError });
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
