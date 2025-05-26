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

    console.log(`🔍 useDocumentLoader: DÉBUT - Tentative ${attempt + 1} pour ${id}`);
    console.log(`🔍 URL actuelle: ${window.location.href}`);
    console.log(`🔍 Paramètres URL: ${window.location.search}`);
    
    try {
      setLoading(true);
      setError(null);

      // LOG: État initial
      console.log("📊 État initial:", {
        documentId: id,
        attempt: attempt + 1,
        supabaseUrl: "https://kytqqjnecezkxyhmmjrz.supabase.co",
        timestamp: new Date().toISOString()
      });

      // ÉTAPE 1: Test fonction RPC publique en PREMIER
      console.log("🔍 ÉTAPE 1: Test fonction RPC get_public_document");
      try {
        const { data: rpcDoc, error: rpcError } = await supabase
          .rpc('get_public_document', { doc_id: id });

        console.log("📊 Résultat RPC:", { 
          success: !rpcError,
          dataLength: rpcDoc?.length || 0,
          error: rpcError?.message,
          data: rpcDoc?.[0] ? {
            id: rpcDoc[0].id,
            file_name: rpcDoc[0].file_name,
            user_id: rpcDoc[0].user_id,
            has_file_path: !!rpcDoc[0].file_path,
            file_path_length: rpcDoc[0].file_path?.length
          } : null
        });

        if (rpcDoc && rpcDoc.length > 0 && !rpcError) {
          console.log("✅ SUCCESS RPC: Document trouvé via RPC:", rpcDoc[0].file_name);
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
          
          console.log("🎯 Document transformé RPC:", {
            id: transformedDoc.id,
            file_name: transformedDoc.file_name,
            file_path_preview: transformedDoc.file_path?.substring(0, 100) + "...",
            content_type: transformedDoc.content_type
          });
          
          setDocument(transformedDoc);
          setLoading(false);
          console.log("✅ TERMINÉ: Document chargé avec succès via RPC");
          return;
        } else {
          console.log("⚠️ RPC: Aucun document retourné ou erreur:", rpcError?.message);
        }
      } catch (rpcException) {
        console.error("❌ EXCEPTION RPC:", rpcException);
      }

      // ÉTAPE 2: Accès direct sans RLS pour diagnostic
      console.log("🔍 ÉTAPE 2: Test accès direct sans RLS");
      try {
        const { data: directTest, error: directTestError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', id);

        console.log("📊 Résultat accès direct:", { 
          success: !directTestError,
          found: directTest?.length || 0, 
          error: directTestError?.message,
          data: directTest?.[0] ? {
            id: directTest[0].id,
            file_name: directTest[0].file_name,
            user_id: directTest[0].user_id,
            has_file_path: !!directTest[0].file_path
          } : null
        });
      } catch (directException) {
        console.error("❌ EXCEPTION accès direct:", directException);
      }

      // ÉTAPE 3: Test authentification
      console.log("🔍 ÉTAPE 3: Vérification authentification");
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        console.log("📊 État auth:", {
          isAuthenticated: !!session,
          userId: session?.user?.id,
          error: authError?.message
        });

        if (session && !authError) {
          console.log("🔍 ÉTAPE 3b: Test accès authentifié");
          const { data: authDoc, error: authDocError } = await supabase
            .from('pdf_documents')
            .select('*')
            .eq('id', id)
            .maybeSingle();

          console.log("📊 Résultat accès authentifié:", { 
            success: !authDocError,
            found: !!authDoc,
            error: authDocError?.message,
            data: authDoc ? {
              id: authDoc.id,
              file_name: authDoc.file_name,
              user_id: authDoc.user_id
            } : null
          });

          if (authDoc && !authDocError) {
            console.log("✅ SUCCESS AUTH: Document trouvé via accès authentifié:", authDoc.file_name);
            const transformedDoc: Document = {
              ...authDoc,
              file_type: authDoc.content_type?.split('/')[1] || 'pdf',
              content_type: authDoc.content_type || 'application/pdf'
            };
            setDocument(transformedDoc);
            setLoading(false);
            console.log("✅ TERMINÉ: Document chargé avec succès via auth");
            return;
          }
        }
      } catch (authException) {
        console.error("❌ EXCEPTION auth:", authException);
      }

      // ÉTAPE 4: Test medical_documents
      console.log("🔍 ÉTAPE 4: Test dans medical_documents");
      try {
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
          console.log("✅ SUCCESS MEDICAL: Document trouvé dans medical_documents:", medicalDoc.file_name);
          const transformedDoc: Document = {
            ...medicalDoc,
            content_type: `application/${medicalDoc.file_type}`
          };
          setDocument(transformedDoc);
          setLoading(false);
          console.log("✅ TERMINÉ: Document chargé avec succès via medical");
          return;
        }
      } catch (medicalException) {
        console.error("❌ EXCEPTION medical:", medicalException);
      }

      // ÉCHEC FINAL
      const finalError = `❌ ÉCHEC COMPLET: Document ${id} introuvable dans toutes les sources`;
      console.error(finalError);
      console.error("🔍 Résumé des échecs pour:", {
        documentId: id,
        attempt: attempt + 1,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });

      throw new Error(`Document introuvable (ID: ${id})`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(`❌ useDocumentLoader: ERREUR finale tentative ${attempt + 1}:`, {
        error: errorMessage,
        documentId: id,
        attempt: attempt + 1,
        willRetry: attempt < 2
      });
      
      if (attempt < 2) {
        console.log(`🔄 RETRY automatique dans ${1000 * (attempt + 1)}ms...`);
        setTimeout(() => {
          setRetryCount(attempt + 1);
          loadDocument(id, attempt + 1);
        }, 1000 * (attempt + 1));
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
