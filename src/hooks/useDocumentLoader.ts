
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
        
        console.log(`AUDIT: Début du chargement du document:`, documentId);
        console.log(`AUDIT: Type du documentId:`, typeof documentId);
        console.log(`AUDIT: Longueur du documentId:`, documentId.length);
        console.log(`AUDIT: Format UUID valide:`, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(documentId));

        // Test de connexion Supabase
        console.log("AUDIT: Test de connexion Supabase...");
        const { data: testData, error: testError } = await supabase
          .from('pdf_documents')
          .select('count')
          .limit(1);
        
        console.log("AUDIT: Test connexion résultat:", { testData, testError });

        // Vérifier si la requête a été annulée
        if (abortController.signal.aborted) {
          console.log("AUDIT: Requête annulée après test connexion");
          return;
        }
        
        // AUDIT 1: Recherche large dans pdf_documents
        console.log("AUDIT: Recherche LARGE dans pdf_documents (tous les documents)...");
        const { data: allPdfDocs, error: allPdfError } = await supabase
          .from('pdf_documents')
          .select('*')
          .limit(5);

        console.log('AUDIT: Tous les pdf_documents (5 premiers):', { data: allPdfDocs, error: allPdfError });

        if (allPdfDocs && allPdfDocs.length > 0) {
          console.log("AUDIT: Premier document trouvé:", allPdfDocs[0]);
          console.log("AUDIT: Comparaison IDs:");
          allPdfDocs.forEach((doc, index) => {
            console.log(`  Doc ${index}: ${doc.id} === ${documentId} ? ${doc.id === documentId}`);
          });
        }

        // AUDIT 2: Recherche spécifique par ID
        console.log("AUDIT: Recherche SPECIFIQUE dans pdf_documents...");
        const { data: pdfData, error: pdfError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId);

        console.log('AUDIT: Résultat recherche spécifique:', { 
          data: pdfData, 
          error: pdfError,
          dataLength: pdfData?.length,
          dataType: typeof pdfData
        });

        if (abortController.signal.aborted) {
          console.log("AUDIT: Requête annulée après recherche spécifique");
          return;
        }

        // AUDIT 3: Vérification des erreurs
        if (pdfError) {
          console.error("AUDIT: Erreur dans pdf_documents:", {
            code: pdfError.code,
            message: pdfError.message,
            details: pdfError.details,
            hint: pdfError.hint
          });
          
          if (pdfError.code !== 'PGRST116') {
            throw pdfError;
          }
        }

        // AUDIT 4: Vérification des données
        if (pdfData && pdfData.length > 0) {
          console.log("AUDIT: Document trouvé dans pdf_documents:", pdfData[0]);
          const newDocument = {
            id: pdfData[0].id,
            file_name: pdfData[0].file_name,
            file_path: pdfData[0].file_path,
            file_type: pdfData[0].content_type || 'application/pdf',
            content_type: pdfData[0].content_type,
            user_id: pdfData[0].user_id,
            created_at: pdfData[0].created_at,
            description: pdfData[0].description,
            file_size: pdfData[0].file_size,
            updated_at: pdfData[0].updated_at,
            external_id: pdfData[0].external_id
          };
          console.log("AUDIT: Document final (pdf):", newDocument);
          setDocument(newDocument);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        // Recherche 2: directives
        console.log("AUDIT: Recherche dans directives...");
        const { data: directiveData, error: directiveError } = await supabase
          .from('directives')
          .select('*')
          .eq('id', documentId);

        console.log('AUDIT: Résultat directives:', { data: directiveData, error: directiveError });

        if (abortController.signal.aborted) {
          return;
        }

        if (directiveError && directiveError.code !== 'PGRST116') {
          console.error("AUDIT: Erreur dans directives:", directiveError);
          throw directiveError;
        }

        if (directiveData && directiveData.length > 0) {
          console.log("AUDIT: Document trouvé dans directives");
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

        // Recherche 3: shared_documents
        console.log("AUDIT: Recherche dans shared_documents...");
        const { data: sharedData, error: sharedError } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('document_id', documentId);

        console.log('AUDIT: Résultat shared_documents:', { data: sharedData, error: sharedError });

        if (abortController.signal.aborted) {
          return;
        }

        if (sharedError && sharedError.code !== 'PGRST116') {
          console.error("AUDIT: Erreur dans shared_documents:", sharedError);
          throw sharedError;
        }

        if (sharedData && sharedData.length > 0) {
          console.log("AUDIT: Document trouvé dans shared_documents");
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

        // AUDIT FINAL: Aucun document trouvé
        const errorMsg = `AUDIT: Document avec l'ID ${documentId} introuvable dans toutes les tables. Détails de l'audit disponibles dans la console.`;
        console.error("AUDIT: ÉCHEC COMPLET:", errorMsg);
        throw new Error(errorMsg);

      } catch (err: any) {
        if (abortController.signal.aborted) {
          console.log("AUDIT: Requête annulée");
          return;
        }

        console.error(`AUDIT: Erreur complète:`, {
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
