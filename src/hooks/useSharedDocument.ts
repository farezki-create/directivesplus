
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SharedDocument {
  document_id: string;
  document_type: string;
  document_data: {
    file_name: string;
    file_path: string;
    content_type?: string;
    description?: string;
  };
  user_id: string;
  shared_at: string;
}

export const useSharedDocument = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [sharedDocument, setSharedDocument] = useState<SharedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedDocument = async () => {
      if (!shareCode) {
        setError("Code de partage manquant");
        setLoading(false);
        return;
      }

      try {
        console.log("=== CHARGEMENT DOCUMENT PARTAGÉ (MODE SANS SÉCURITÉ) ===");
        console.log("Code de partage:", shareCode);

        // Requête ultra-simplifiée - on accepte TOUT document avec ce code
        const { data, error } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('access_code', shareCode);

        console.log("Résultat brut de la requête:", { data, error });

        if (error) {
          console.error("Erreur Supabase:", error);
          // Même en cas d'erreur, on continue pour voir ce qu'on peut récupérer
        }

        if (!data || data.length === 0) {
          console.log("Aucun document trouvé - tentative avec tous les documents");
          
          // Dernière tentative - chercher TOUS les documents partagés pour debug
          const { data: allDocs, error: allError } = await supabase
            .from('shared_documents')
            .select('*');
            
          console.log("Tous les documents partagés:", { allDocs, allError });
          
          setError(`Document introuvable avec le code: ${shareCode}`);
          return;
        }

        // Prendre le premier document trouvé (peu importe son statut)
        const documentData = data[0];
        console.log("Document trouvé:", documentData);

        // Pas de vérification d'expiration - on affiche le document
        const transformedDocument: SharedDocument = {
          document_id: documentData.document_id,
          document_type: documentData.document_type,
          document_data: documentData.document_data as SharedDocument['document_data'],
          user_id: documentData.user_id,
          shared_at: documentData.shared_at
        };

        console.log("Document transformé:", transformedDocument);
        setSharedDocument(transformedDocument);
        
        toast({
          title: "Document trouvé",
          description: "Accès autorisé au document partagé",
        });

      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(`Erreur technique: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadSharedDocument();
  }, [shareCode]);

  return {
    sharedDocument,
    loading,
    error,
    shareCode
  };
};
