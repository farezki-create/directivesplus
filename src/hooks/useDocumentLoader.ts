
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

      // ÉTAPE 1: Essayer d'abord l'accès direct sans RLS pour débugger
      console.log("ÉTAPE 1: Test accès direct au document...");
      
      // Désactiver temporairement RLS pour ce test
      const { data: directTest, error: directTestError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('id', id);

      console.log("Test accès direct - Résultat:", { 
        found: directTest?.length || 0, 
        error: directTestError,
        data: directTest?.[0] ? {
          id: directTest[0].id,
          file_name: directTest[0].file_name,
          user_id: directTest[0].user_id
        } : null
      });

      // ÉTAPE 2: Essayer la fonction RPC publique
      console.log("ÉTAPE 2: Test fonction RPC get_public_document...");
      const { data: rpcDoc, error: rpcError } = await supabase
        .rpc('get_public_document', { doc_id: id });

      console.log("RPC get_public_document - Résultat:", { 
        found: rpcDoc?.length || 0,
        error: rpcError,
        data: rpcDoc?.[0] ? {
          id: rpcDoc[0].id,
          file_name: rpcDoc[0].file_name,
          user_id: rpcDoc[0].user_id
        } : null
      });

      // Si on a des données via RPC, les utiliser
      if (rpcDoc && rpcDoc.length > 0 && !rpcError) {
        console.log("✅ Document trouvé via RPC:", rpcDoc[0].file_name);
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
        
        console.log("Document transformé:", {
          id: transformedDoc.id,
          file_name: transformedDoc.file_name,
          file_path: transformedDoc.file_path?.substring(0, 50) + "..."
        });
        
        setDocument(transformedDoc);
        setLoading(false);
        return;
      }

      // ÉTAPE 3: Si RPC échoue, essayer accès authentifié
      console.log("ÉTAPE 3: Test accès authentifié...");
      const { data: authDoc, error: authError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      console.log("Accès authentifié - Résultat:", { 
        found: !!authDoc,
        error: authError,
        data: authDoc ? {
          id: authDoc.id,
          file_name: authDoc.file_name,
          user_id: authDoc.user_id
        } : null
      });

      if (authDoc && !authError) {
        console.log("✅ Document trouvé via accès authentifié:", authDoc.file_name);
        const transformedDoc: Document = {
          ...authDoc,
          file_type: authDoc.content_type?.split('/')[1] || 'pdf',
          content_type: authDoc.content_type || 'application/pdf'
        };
        setDocument(transformedDoc);
        setLoading(false);
        return;
      }

      // ÉTAPE 4: Essayer dans medical_documents
      console.log("ÉTAPE 4: Test dans medical_documents...");
      const { data: medicalDoc, error: medicalError } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      console.log("Medical documents - Résultat:", { 
        found: !!medicalDoc,
        error: medicalError
      });

      if (medicalDoc && !medicalError) {
        console.log("✅ Document trouvé dans medical_documents:", medicalDoc.file_name);
        const transformedDoc: Document = {
          ...medicalDoc,
          content_type: `application/${medicalDoc.file_type}`
        };
        setDocument(transformedDoc);
        setLoading(false);
        return;
      }

      // ÉTAPE 5: Aucun document trouvé
      console.error("❌ AUCUN DOCUMENT TROUVÉ - Résumé des erreurs:", {
        rpcError: rpcError?.message,
        authError: authError?.message,
        medicalError: medicalError?.message,
        documentId: id
      });

      throw new Error(`Document non trouvé (ID: ${id})`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(`❌ useDocumentLoader: Erreur tentative ${attempt + 1}:`, {
        error: errorMessage,
        documentId: id,
        attempt: attempt + 1
      });
      
      if (attempt < 2) {
        console.log(`🔄 Retry automatique dans 1 seconde...`);
        setTimeout(() => {
          loadDocument(id, attempt + 1);
        }, 1000 * (attempt + 1));
        return;
      }

      setError(errorMessage);
      setDocument(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      console.log("🔍 useDocumentLoader: Démarrage du chargement pour:", documentId);
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
      console.log(`🔄 useDocumentLoader: Retry manuel ${newRetryCount}/3`);
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
