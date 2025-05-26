
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

    console.log(`🔍 useDocumentLoader: TENTATIVE ${attempt + 1} pour document ${id}`);
    
    try {
      setLoading(true);
      setError(null);

      // MÉTHODE 1: Fonction RPC publique (prioritaire pour QR codes)
      console.log("🔍 ÉTAPE 1: Test fonction RPC get_public_document");
      const { data: rpcDoc, error: rpcError } = await supabase
        .rpc('get_public_document', { doc_id: id });

      console.log("📊 Résultat RPC:", { 
        success: !rpcError,
        dataFound: rpcDoc?.length > 0,
        error: rpcError?.message
      });

      if (rpcDoc && rpcDoc.length > 0 && !rpcError) {
        console.log("✅ SUCCESS RPC: Document trouvé:", rpcDoc[0].file_name);
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
        console.log("✅ DOCUMENT CHARGÉ avec succès via RPC");
        return;
      }

      // MÉTHODE 2: Accès authentifié si RPC échoue
      console.log("🔍 ÉTAPE 2: Test accès authentifié");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("🔍 Session trouvée, test accès authentifié");
        const { data: authDoc, error: authError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        console.log("📊 Résultat accès authentifié:", { 
          success: !authError,
          found: !!authDoc,
          error: authError?.message
        });

        if (authDoc && !authError) {
          console.log("✅ SUCCESS AUTH: Document trouvé:", authDoc.file_name);
          const transformedDoc: Document = {
            ...authDoc,
            file_type: authDoc.content_type?.split('/')[1] || 'pdf',
            content_type: authDoc.content_type || 'application/pdf'
          };
          setDocument(transformedDoc);
          setLoading(false);
          console.log("✅ DOCUMENT CHARGÉ avec succès via auth");
          return;
        }
      }

      // MÉTHODE 3: Test dans medical_documents
      console.log("🔍 ÉTAPE 3: Test dans medical_documents");
      const { data: medicalDoc, error: medicalError } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      console.log("📊 Résultat medical_documents:", { 
        success: !medicalError,
        found: !!medicalDoc,
        error: medicalError?.message
      });

      if (medicalDoc && !medicalError) {
        console.log("✅ SUCCESS MEDICAL: Document trouvé:", medicalDoc.file_name);
        const transformedDoc: Document = {
          ...medicalDoc,
          content_type: `application/${medicalDoc.file_type}`
        };
        setDocument(transformedDoc);
        setLoading(false);
        console.log("✅ DOCUMENT CHARGÉ avec succès via medical");
        return;
      }

      // ÉCHEC: Aucune méthode n'a fonctionné
      const finalError = `Document ${id} introuvable dans toutes les sources`;
      console.error("❌ ÉCHEC COMPLET:", finalError);
      throw new Error(finalError);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(`❌ useDocumentLoader: ERREUR tentative ${attempt + 1}:`, errorMessage);
      
      // Retry automatique jusqu'à 2 tentatives
      if (attempt < 2) {
        const retryDelay = 1000 * (attempt + 1);
        console.log(`🔄 RETRY automatique dans ${retryDelay}ms...`);
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
      console.log("🚀 useDocumentLoader: DÉMARRAGE pour:", documentId);
      setRetryCount(0);
      loadDocument(documentId);
    } else {
      console.log("⚠️ useDocumentLoader: Aucun document ID fourni");
      setDocument(null);
      setLoading(false);
      setError(null);
    }
  }, [documentId]);

  const retryLoad = () => {
    if (documentId && retryCount < 3) {
      const newRetryCount = retryCount + 1;
      console.log(`🔄 useDocumentLoader: RETRY MANUEL ${newRetryCount}/3`);
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
