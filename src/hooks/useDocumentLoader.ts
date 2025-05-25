
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
        
        console.log("AUDIT: ===========================================");
        console.log("AUDIT: DÉMARRAGE AUDIT COMPLET");
        console.log(`AUDIT: Document ID recherché: ${documentId}`);
        console.log(`AUDIT: Type: ${typeof documentId}, Longueur: ${documentId.length}`);
        console.log(`AUDIT: Format UUID valide: ${/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(documentId)}`);

        // Vérification de l'état d'authentification
        console.log("AUDIT: Vérification de l'état d'authentification...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("AUDIT: Session actuelle:", {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          sessionError
        });

        if (abortController.signal.aborted) return;

        // Test de connexion Supabase
        console.log("AUDIT: Test de connexion Supabase...");
        const { data: testData, error: testError } = await supabase
          .from('pdf_documents')
          .select('id')
          .limit(1);
        
        console.log("AUDIT: Test connexion - Données:", testData);
        console.log("AUDIT: Test connexion - Erreur:", testError);

        if (abortController.signal.aborted) return;

        // ÉTAPE 1: Tentative avec la nouvelle fonction RPC pour contourner RLS
        console.log("AUDIT: Tentative avec la nouvelle fonction RPC get_public_document...");
        
        const { data: publicDocuments, error: publicError } = await supabase.rpc('get_public_document', {
          doc_id: documentId
        });

        if (abortController.signal.aborted) return;

        console.log("AUDIT: RPC get_public_document - Données:", publicDocuments);
        console.log("AUDIT: RPC get_public_document - Erreur:", publicError);

        if (publicDocuments && Array.isArray(publicDocuments) && publicDocuments.length > 0) {
          console.log("AUDIT: ✅ Document trouvé via RPC public:", publicDocuments[0]);
          const docData = publicDocuments[0];
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

        console.log("AUDIT: ❌ RPC non disponible ou aucun résultat, fallback sur requêtes directes...");

        // ÉTAPE 2: Fallback - recherche directe dans pdf_documents
        console.log("AUDIT: ====== RECHERCHE DANS PDF_DOCUMENTS ======");
        
        // Recherche large pour débug
        const { data: allDocuments, error: allError } = await supabase
          .from('pdf_documents')
          .select('*')
          .limit(5);

        console.log("AUDIT: Recherche large - Nombre total:", allDocuments?.length || 0);
        console.log("AUDIT: Recherche large - Données brutes:", allDocuments);
        console.log("AUDIT: Recherche large - Erreur détaillée:", allError);

        if (allDocuments && allDocuments.length > 0) {
          console.log("AUDIT: ✅ Des documents existent dans la base");
        } else {
          console.log("AUDIT: ❌ Aucun document trouvé dans pdf_documents");
        }

        // Recherche spécifique
        console.log("AUDIT: Recherche spécifique dans pdf_documents...");
        const { data: rawDocuments, error: rawError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId);

        console.log("AUDIT: Recherche spécifique - Données:", rawDocuments);
        console.log("AUDIT: Recherche spécifique - Erreur:", rawError);
        console.log("AUDIT: Recherche spécifique - Type de données:", typeof rawDocuments);
        console.log("AUDIT: Recherche spécifique - Est-ce un array?", Array.isArray(rawDocuments));
        console.log("AUDIT: Recherche spécifique - Longueur:", rawDocuments?.length);

        if (abortController.signal.aborted) return;

        if (rawDocuments && Array.isArray(rawDocuments) && rawDocuments.length > 0) {
          console.log("AUDIT: ✅ Document trouvé directement dans pdf_documents");
          const rawDoc = rawDocuments[0];
          const newDocument = {
            id: rawDoc.id,
            file_name: rawDoc.file_name,
            file_path: rawDoc.file_path,
            file_type: rawDoc.content_type || 'application/pdf',
            content_type: rawDoc.content_type,
            user_id: rawDoc.user_id,
            created_at: rawDoc.created_at,
            description: rawDoc.description,
            file_size: rawDoc.file_size,
            updated_at: rawDoc.updated_at,
            external_id: rawDoc.external_id
          };
          
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        console.log("AUDIT: ❌ Document non trouvé dans pdf_documents, recherche dans directives...");

        // ÉTAPE 3: Recherche dans les directives
        const { data: directiveData, error: directiveError } = await supabase
          .from('directives')
          .select('*')
          .eq('id', documentId);

        console.log("AUDIT: Directives - Données:", directiveData);
        console.log("AUDIT: Directives - Erreur:", directiveError);

        if (abortController.signal.aborted) return;

        if (directiveData && Array.isArray(directiveData) && directiveData.length > 0) {
          console.log("AUDIT: ✅ Document trouvé dans directives");
          const directive = directiveData[0];
          const content = directive.content as any;
          const newDocument = {
            id: directive.id,
            file_name: content?.title || content?.titre || 'Directive anticipée',
            file_path: `data:application/pdf;base64,${btoa('PDF directive')}`,
            file_type: 'application/json',
            content_type: 'application/json',
            user_id: directive.user_id,
            created_at: directive.created_at,
            description: 'Directive anticipée',
            content: directive.content
          };
          
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        console.log("AUDIT: ❌ Document non trouvé dans directives, recherche dans shared_documents...");

        // ÉTAPE 4: Recherche dans shared_documents
        const { data: sharedData, error: sharedError } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('document_id', documentId);

        console.log("AUDIT: Shared documents - Données:", sharedData);
        console.log("AUDIT: Shared documents - Erreur:", sharedError);

        if (abortController.signal.aborted) return;

        if (sharedData && Array.isArray(sharedData) && sharedData.length > 0) {
          console.log("AUDIT: ✅ Document trouvé dans shared_documents");
          const shared = sharedData[0];
          const documentData = shared.document_data as any;
          const newDocument = {
            id: shared.document_id,
            file_name: documentData?.file_name || `Document partagé`,
            file_path: documentData?.file_path || '#',
            file_type: shared.document_type || 'application/pdf',
            content_type: shared.document_type,
            user_id: shared.user_id,
            created_at: shared.shared_at,
            description: 'Document partagé'
          };
          
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        // DIAGNOSTIC FINAL
        console.log("AUDIT: ===========================================");
        console.log("AUDIT: ❌ ÉCHEC COMPLET - RÉSUMÉ:");
        console.log(`AUDIT: - Document ID: ${documentId}`);
        console.log(`AUDIT: - Session utilisateur: ${!!session ? 'OUI' : 'NON'}`);
        console.log(`AUDIT: - pdf_documents: ${rawDocuments?.length || 0} résultats`);
        console.log(`AUDIT: - directives: ${directiveData?.length || 0} résultats`);
        console.log(`AUDIT: - shared_documents: ${sharedData?.length || 0} résultats`);
        console.log("AUDIT: ===========================================");
        
        const errorMsg = `Document avec l'ID ${documentId} introuvable dans toutes les tables. Vérifiez que l'ID est correct et que vous avez les permissions d'accès.`;
        throw new Error(errorMsg);

      } catch (err: any) {
        if (abortController.signal.aborted) {
          console.log("AUDIT: Requête annulée");
          return;
        }

        console.log("AUDIT: ❌ ERREUR DANS LE PROCESSUS:", {
          error: err,
          message: err.message,
          stack: err.stack,
          name: err.name
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
      console.log("AUDIT: Retry manuel déclenché");
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
