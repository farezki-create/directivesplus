
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
        
        console.log(`AUDIT: ===========================================`);
        console.log(`AUDIT: DÉMARRAGE AUDIT COMPLET`);
        console.log(`AUDIT: Document ID recherché: ${documentId}`);
        console.log(`AUDIT: Type: ${typeof documentId}, Longueur: ${documentId.length}`);
        console.log(`AUDIT: Format UUID valide: ${/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(documentId)}`);

        // AUDIT 0: Vérifier l'authentification
        console.log("AUDIT: Vérification de l'état d'authentification...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("AUDIT: Session actuelle:", {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          sessionError
        });

        // AUDIT 1: Test de connexion Supabase basique
        console.log("AUDIT: Test de connexion Supabase...");
        const { data: testData, error: testError } = await supabase
          .from('pdf_documents')
          .select('count')
          .limit(1);
        
        console.log("AUDIT: Test connexion - Données:", testData);
        console.log("AUDIT: Test connexion - Erreur:", testError);

        if (abortController.signal.aborted) {
          console.log("AUDIT: Requête annulée après test connexion");
          return;
        }
        
        // AUDIT 2: Recherche large dans pdf_documents AVEC détails complets
        console.log("AUDIT: ====== RECHERCHE DANS PDF_DOCUMENTS ======");
        const { data: allPdfDocs, error: allPdfError, count: totalCount } = await supabase
          .from('pdf_documents')
          .select('*', { count: 'exact' })
          .limit(10);

        console.log('AUDIT: Recherche large - Nombre total:', totalCount);
        console.log('AUDIT: Recherche large - Données brutes:', allPdfDocs);
        console.log('AUDIT: Recherche large - Erreur détaillée:', allPdfError);

        if (allPdfDocs && allPdfDocs.length > 0) {
          console.log("AUDIT: Documents trouvés - comparaison des IDs:");
          allPdfDocs.forEach((doc, index) => {
            const idMatch = doc.id === documentId;
            console.log(`  📄 Doc ${index + 1}: ID="${doc.id}" | Nom="${doc.file_name}" | Match=${idMatch}`);
            if (idMatch) {
              console.log(`  ✅ TROUVÉ! Document correspondant:`, doc);
            }
          });
        } else {
          console.log("AUDIT: ❌ Aucun document trouvé dans pdf_documents");
        }

        // AUDIT 3: Recherche spécifique par ID dans pdf_documents
        console.log("AUDIT: Recherche spécifique dans pdf_documents...");
        const { data: pdfData, error: pdfError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId);

        console.log('AUDIT: Recherche spécifique - Données:', pdfData);
        console.log('AUDIT: Recherche spécifique - Erreur:', pdfError);
        console.log('AUDIT: Recherche spécifique - Type de données:', typeof pdfData);
        console.log('AUDIT: Recherche spécifique - Est-ce un array?', Array.isArray(pdfData));
        console.log('AUDIT: Recherche spécifique - Longueur:', pdfData?.length);

        if (abortController.signal.aborted) {
          console.log("AUDIT: Requête annulée après recherche spécifique");
          return;
        }

        // AUDIT 4: Vérification des erreurs
        if (pdfError) {
          console.error("AUDIT: ❌ ERREUR dans pdf_documents:", {
            code: pdfError.code,
            message: pdfError.message,
            details: pdfError.details,
            hint: pdfError.hint
          });
          
          if (pdfError.code !== 'PGRST116') {
            throw pdfError;
          }
        }

        // AUDIT 5: Traitement des données trouvées
        if (pdfData && pdfData.length > 0) {
          console.log("AUDIT: ✅ Document trouvé dans pdf_documents:", pdfData[0]);
          const foundDoc = pdfData[0];
          const newDocument = {
            id: foundDoc.id,
            file_name: foundDoc.file_name,
            file_path: foundDoc.file_path,
            file_type: foundDoc.content_type || 'application/pdf',
            content_type: foundDoc.content_type,
            user_id: foundDoc.user_id,
            created_at: foundDoc.created_at,
            description: foundDoc.description,
            file_size: foundDoc.file_size,
            updated_at: foundDoc.updated_at,
            external_id: foundDoc.external_id
          };
          console.log("AUDIT: Document formaté:", newDocument);
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          console.log("AUDIT: ===========================================");
          return;
        }

        console.log("AUDIT: ❌ Document non trouvé dans pdf_documents, recherche dans directives...");

        // Recherche dans directives
        const { data: directiveData, error: directiveError } = await supabase
          .from('directives')
          .select('*')
          .eq('id', documentId);

        console.log('AUDIT: Directives - Données:', directiveData);
        console.log('AUDIT: Directives - Erreur:', directiveError);

        if (abortController.signal.aborted) {
          return;
        }

        if (directiveError && directiveError.code !== 'PGRST116') {
          console.error("AUDIT: Erreur dans directives:", directiveError);
          throw directiveError;
        }

        if (directiveData && directiveData.length > 0) {
          console.log("AUDIT: ✅ Document trouvé dans directives");
          const content = directiveData[0].content as any;
          const newDocument = {
            id: directiveData[0].id,
            file_name: content?.title || content?.titre || 'Directive anticipée',
            file_path: `data:application/pdf;base64,${btoa('PDF directive')}`,
            file_type: 'application/json',
            content_type: 'application/json',
            user_id: directiveData[0].user_id,
            created_at: directiveData[0].created_at,
            description: 'Directive anticipée',
            content: directiveData[0].content
          };
          console.log("AUDIT: Document final (directive):", newDocument);
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        console.log("AUDIT: ❌ Document non trouvé dans directives, recherche dans shared_documents...");

        // Recherche dans shared_documents
        const { data: sharedData, error: sharedError } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('document_id', documentId);

        console.log('AUDIT: Shared documents - Données:', sharedData);
        console.log('AUDIT: Shared documents - Erreur:', sharedError);

        if (abortController.signal.aborted) {
          return;
        }

        if (sharedError && sharedError.code !== 'PGRST116') {
          console.error("AUDIT: Erreur dans shared_documents:", sharedError);
          throw sharedError;
        }

        if (sharedData && sharedData.length > 0) {
          console.log("AUDIT: ✅ Document trouvé dans shared_documents");
          const documentData = sharedData[0].document_data as any;
          const newDocument = {
            id: sharedData[0].document_id,
            file_name: `Document partagé`,
            file_path: documentData?.file_path || '#',
            file_type: sharedData[0].document_type || 'application/pdf',
            content_type: sharedData[0].document_type,
            user_id: sharedData[0].user_id,
            created_at: sharedData[0].shared_at,
            description: 'Document partagé'
          };
          console.log("AUDIT: Document final (shared):", newDocument);
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        // AUDIT FINAL: Résumé complet
        console.log("AUDIT: ===========================================");
        console.log("AUDIT: ❌ ÉCHEC COMPLET - RÉSUMÉ:");
        console.log(`AUDIT: - Document ID: ${documentId}`);
        console.log(`AUDIT: - Session utilisateur: ${session ? 'OUI' : 'NON'}`);
        console.log(`AUDIT: - pdf_documents: ${pdfData?.length || 0} résultats`);
        console.log(`AUDIT: - directives: ${directiveData?.length || 0} résultats`);
        console.log(`AUDIT: - shared_documents: ${sharedData?.length || 0} résultats`);
        console.log("AUDIT: ===========================================");
        
        const errorMsg = `Document avec l'ID ${documentId} introuvable dans toutes les tables. Vérifiez que l'ID est correct et que vous avez les permissions d'accès.`;
        console.error("AUDIT: ERREUR FINALE:", errorMsg);
        throw new Error(errorMsg);

      } catch (err: any) {
        if (abortController.signal.aborted) {
          console.log("AUDIT: Requête annulée");
          return;
        }

        console.error(`AUDIT: ❌ ERREUR DANS LE PROCESSUS:`, {
          error: err,
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        
        const errorMessage = err.message || 'Impossible de charger le document';
        console.error("AUDIT: Erreur finale:", errorMessage);
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
