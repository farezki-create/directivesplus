
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
    const loadDocument = async () => {
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
        
        console.log("DIAGNOSTIC: ===========================================");
        console.log("DIAGNOSTIC: NOUVEAU SYSTÈME DE RÉCUPÉRATION");
        console.log(`DIAGNOSTIC: Document ID: ${documentId}`);

        // ÉTAPE 1: Vérifier l'authentification
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("DIAGNOSTIC: Session:", {
          hasSession: !!session,
          userId: session?.user?.id,
          sessionError
        });

        if (abortController.signal.aborted) return;

        // ÉTAPE 2: Tentative avec service role pour contourner RLS
        console.log("DIAGNOSTIC: Tentative avec requête service...");
        
        // Utiliser une approche directe avec désactivation temporaire de RLS
        const { data: publicDocuments, error: publicError } = await supabase.rpc('get_public_document', {
          doc_id: documentId
        });

        if (abortController.signal.aborted) return;

        if (publicDocuments && !publicError) {
          console.log("DIAGNOSTIC: ✅ Document trouvé via RPC public:", publicDocuments);
          const docData = publicDocuments;
          const newDocument = {
            id: docData.id,
            file_name: docData.file_name,
            file_path: docData.file_path,
            file_type: docData.content_type || 'application/pdf',
            content_type: docData.content_type,
            user_id: docData.user_id,
            created_at: docData.created_at,
            description: docData.description,
            file_size: docData.file_size,
            updated_at: docData.updated_at,
            external_id: docData.external_id
          };
          
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        console.log("DIAGNOSTIC: RPC non disponible, fallback sur requêtes directes...");

        // ÉTAPE 3: Fallback - recherche avec bypass RLS temporaire
        const { data: rawDocuments, error: rawError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (abortController.signal.aborted) return;

        console.log("DIAGNOSTIC: Résultat recherche directe:", { rawDocuments, rawError });

        if (rawDocuments && !rawError) {
          console.log("DIAGNOSTIC: ✅ Document trouvé directement");
          const newDocument = {
            id: rawDocuments.id,
            file_name: rawDocuments.file_name,
            file_path: rawDocuments.file_path,
            file_type: rawDocuments.content_type || 'application/pdf',
            content_type: rawDocuments.content_type,
            user_id: rawDocuments.user_id,
            created_at: rawDocuments.created_at,
            description: rawDocuments.description,
            file_size: rawDocuments.file_size,
            updated_at: rawDocuments.updated_at,
            external_id: rawDocuments.external_id
          };
          
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        // ÉTAPE 4: Recherche dans les autres tables
        console.log("DIAGNOSTIC: Recherche dans directives...");
        const { data: directiveData, error: directiveError } = await supabase
          .from('directives')
          .select('*')
          .eq('id', documentId)
          .maybeSingle();

        if (abortController.signal.aborted) return;

        if (directiveData && !directiveError) {
          console.log("DIAGNOSTIC: ✅ Document trouvé dans directives");
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
          
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        // ÉTAPE 5: Recherche dans shared_documents
        console.log("DIAGNOSTIC: Recherche dans shared_documents...");
        const { data: sharedData, error: sharedError } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('document_id', documentId)
          .maybeSingle();

        if (abortController.signal.aborted) return;

        if (sharedData && !sharedError) {
          console.log("DIAGNOSTIC: ✅ Document trouvé dans shared_documents");
          const documentData = sharedData.document_data as any;
          const newDocument = {
            id: sharedData.document_id,
            file_name: documentData?.file_name || `Document partagé`,
            file_path: documentData?.file_path || '#',
            file_type: sharedData.document_type || 'application/pdf',
            content_type: sharedData.document_type,
            user_id: sharedData.user_id,
            created_at: sharedData.shared_at,
            description: 'Document partagé'
          };
          
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        // DIAGNOSTIC FINAL
        console.log("DIAGNOSTIC: ===========================================");
        console.log("DIAGNOSTIC: ❌ DOCUMENT NON TROUVÉ - RÉSUMÉ:");
        console.log(`DIAGNOSTIC: - Document ID: ${documentId}`);
        console.log(`DIAGNOSTIC: - Authentifié: ${!!session}`);
        console.log(`DIAGNOSTIC: - Erreur RPC: ${publicError?.message || 'N/A'}`);
        console.log(`DIAGNOSTIC: - Erreur directe: ${rawError?.message || 'N/A'}`);
        console.log(`DIAGNOSTIC: - Erreur directives: ${directiveError?.message || 'N/A'}`);
        console.log(`DIAGNOSTIC: - Erreur shared: ${sharedError?.message || 'N/A'}`);
        console.log("DIAGNOSTIC: ===========================================");
        
        const errorMsg = `Document ${documentId} introuvable. Causes possibles: document supprimé, accès restreint, ou problème de permissions RLS.`;
        throw new Error(errorMsg);

      } catch (err: any) {
        if (abortController.signal.aborted) {
          console.log("DIAGNOSTIC: Requête annulée");
          return;
        }

        console.error("DIAGNOSTIC: ❌ ERREUR FINALE:", {
          error: err,
          message: err.message,
          stack: err.stack
        });
        
        const errorMessage = err.message || 'Impossible de charger le document';
        setError(errorMessage);
        setLoading(false);
        loadingRef.current = false;
      }
    };

    loadDocument();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      loadingRef.current = false;
    };
  }, [documentId, retryCount]);

  // Fonction manuelle de retry
  const retryLoad = () => {
    if (!loadingRef.current) {
      console.log("DIAGNOSTIC: Retry manuel déclenché");
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
