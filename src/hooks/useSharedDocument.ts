
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
        console.log("=== DIAGNOSTIC COMPLET SHARED DOCUMENTS ===");
        console.log("Code recherché:", shareCode);

        // 1. Vérifier TOUS les documents partagés
        const { data: allSharedDocs, error: allError } = await supabase
          .from('shared_documents')
          .select('*');

        console.log("1. TOUS les documents partagés:", { allSharedDocs, allError });
        console.log("1. Nombre total de documents partagés:", allSharedDocs?.length || 0);

        if (allSharedDocs && allSharedDocs.length > 0) {
          console.log("1. Codes d'accès existants:", allSharedDocs.map(doc => doc.access_code));
          console.log("1. Types de documents:", allSharedDocs.map(doc => doc.document_type));
          console.log("1. Status actifs:", allSharedDocs.map(doc => doc.is_active));
        }

        // 2. Recherche exacte par code
        const { data: exactMatch, error: exactError } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('access_code', shareCode);

        console.log("2. Recherche exacte par code:", { exactMatch, exactError });

        // 3. Recherche insensible à la casse
        const { data: caseInsensitiveMatch, error: caseError } = await supabase
          .from('shared_documents')
          .select('*')
          .ilike('access_code', shareCode);

        console.log("3. Recherche insensible à la casse:", { caseInsensitiveMatch, caseError });

        // 4. Recherche avec LIKE pour débug
        const { data: likeMatch, error: likeError } = await supabase
          .from('shared_documents')
          .select('*')
          .like('access_code', `%${shareCode}%`);

        console.log("4. Recherche avec LIKE:", { likeMatch, likeError });

        // 5. Vérifier si le code existe mais avec d'autres conditions
        const { data: codeExists, error: codeError } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('access_code', shareCode)
          .single();

        console.log("5. Test single() pour le code:", { codeExists, codeError });

        // Utiliser le résultat de la recherche exacte
        if (exactMatch && exactMatch.length > 0) {
          const documentData = exactMatch[0];
          console.log("✅ Document trouvé:", documentData);

          const transformedDocument: SharedDocument = {
            document_id: documentData.document_id,
            document_type: documentData.document_type,
            document_data: documentData.document_data as SharedDocument['document_data'],
            user_id: documentData.user_id,
            shared_at: documentData.shared_at
          };

          console.log("✅ Document transformé:", transformedDocument);
          setSharedDocument(transformedDocument);
          
          toast({
            title: "Document trouvé",
            description: "Accès autorisé au document partagé",
          });
        } else {
          console.log("❌ Aucun document trouvé avec le code exact");
          
          // Diagnostic final
          console.log("=== DIAGNOSTIC FINAL ===");
          console.log("Code recherché (type):", typeof shareCode, shareCode);
          console.log("Code recherché (longueur):", shareCode.length);
          console.log("Code recherché (trimmed):", shareCode.trim());
          console.log("Codes existants pour comparaison:", allSharedDocs?.map(doc => ({
            code: doc.access_code,
            type: typeof doc.access_code,
            length: doc.access_code?.length,
            equal: doc.access_code === shareCode,
            trimEqual: doc.access_code?.trim() === shareCode.trim()
          })));

          setError(`Document introuvable. Code recherché: "${shareCode}". Voir logs pour détails.`);
        }

      } catch (err) {
        console.error("❌ Erreur lors du diagnostic:", err);
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
