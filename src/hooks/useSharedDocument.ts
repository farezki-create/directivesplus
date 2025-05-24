
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
        console.log("=== DIAGNOSTIC ÉTENDU SHARED DOCUMENTS ===");
        console.log("Code recherché:", shareCode);
        console.log("Type du code:", typeof shareCode);
        console.log("Longueur du code:", shareCode.length);

        // 1. Vérifier TOUS les documents partagés
        const { data: allSharedDocs, error: allError } = await supabase
          .from('shared_documents')
          .select('*');

        console.log("1. TOUS les documents partagés:", { allSharedDocs, allError });
        console.log("1. Nombre total:", allSharedDocs?.length || 0);

        if (allSharedDocs && allSharedDocs.length > 0) {
          console.log("1. Codes existants:", allSharedDocs.map(doc => ({
            code: doc.access_code,
            type: typeof doc.access_code,
            length: doc.access_code?.length,
            active: doc.is_active,
            expires: doc.expires_at
          })));
        }

        // 2. Vérifier dans la table profiles (au cas où le code serait là)
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, medical_access_code')
          .not('medical_access_code', 'is', null);

        console.log("2. Codes dans profiles:", { profilesData, profilesError });

        // 3. Recherche exacte dans shared_documents
        const { data: exactMatch, error: exactError } = await supabase
          .from('shared_documents')
          .select('*')
          .eq('access_code', shareCode);

        console.log("3. Recherche exacte shared_documents:", { exactMatch, exactError });

        // 4. Recherche dans document_access_codes
        const { data: accessCodes, error: accessError } = await supabase
          .from('document_access_codes')
          .select('*')
          .eq('access_code', shareCode);

        console.log("4. Recherche dans document_access_codes:", { accessCodes, accessError });

        // 5. Test de requête RPC si elle existe
        try {
          const { data: rpcResult, error: rpcError } = await supabase
            .rpc('get_shared_documents_by_access_code', { 
              input_access_code: shareCode 
            });
          console.log("5. Test RPC get_shared_documents_by_access_code:", { rpcResult, rpcError });
        } catch (rpcErr) {
          console.log("5. RPC non disponible ou erreur:", rpcErr);
        }

        // 6. Recherche dans toutes les tables avec des codes d'accès
        const tables = ['shared_documents', 'document_access_codes', 'profiles'];
        for (const table of tables) {
          try {
            const { data: tableData, error: tableError } = await supabase
              .from(table)
              .select('*')
              .or(`access_code.eq.${shareCode},medical_access_code.eq.${shareCode}`);
            console.log(`6. Recherche dans ${table}:`, { tableData, tableError });
          } catch (err) {
            console.log(`6. Erreur recherche ${table}:`, err);
          }
        }

        // Logique de traitement du résultat
        if (exactMatch && exactMatch.length > 0) {
          const documentData = exactMatch[0];
          console.log("✅ Document trouvé dans shared_documents:", documentData);

          const transformedDocument: SharedDocument = {
            document_id: documentData.document_id,
            document_type: documentData.document_type,
            document_data: documentData.document_data as SharedDocument['document_data'],
            user_id: documentData.user_id,
            shared_at: documentData.shared_at
          };

          setSharedDocument(transformedDocument);
          
          toast({
            title: "Document trouvé",
            description: "Accès autorisé au document partagé",
          });
        } else if (accessCodes && accessCodes.length > 0) {
          console.log("✅ Code trouvé dans document_access_codes:", accessCodes[0]);
          
          // Récupérer le document associé
          const { data: docData, error: docError } = await supabase
            .from('pdf_documents')
            .select('*')
            .eq('id', accessCodes[0].document_id)
            .single();

          if (docData && !docError) {
            const transformedDocument: SharedDocument = {
              document_id: docData.id,
              document_type: 'pdf_document',
              document_data: {
                file_name: docData.file_name,
                file_path: docData.file_path,
                content_type: docData.content_type,
                description: docData.description
              },
              user_id: docData.user_id || accessCodes[0].user_id,
              shared_at: accessCodes[0].created_at
            };

            setSharedDocument(transformedDocument);
            
            toast({
              title: "Document trouvé",
              description: "Accès autorisé via code d'accès",
            });
          } else {
            console.log("❌ Document associé non trouvé:", { docData, docError });
            setError("Document associé introuvable");
          }
        } else {
          console.log("❌ Code non trouvé dans aucune table");
          
          // Diagnostic final très détaillé
          console.log("=== DIAGNOSTIC FINAL DÉTAILLÉ ===");
          console.log("Code recherché (brut):", JSON.stringify(shareCode));
          console.log("Code recherché (échappé):", escape(shareCode));
          console.log("Code en hexa:", Array.from(shareCode).map(c => c.charCodeAt(0).toString(16)).join(' '));
          
          if (allSharedDocs) {
            allSharedDocs.forEach((doc, index) => {
              console.log(`Comparaison ${index + 1}:`, {
                codeDB: JSON.stringify(doc.access_code),
                codeRecherche: JSON.stringify(shareCode),
                egal: doc.access_code === shareCode,
                equalIgnoreCase: doc.access_code?.toLowerCase() === shareCode.toLowerCase(),
                includes: doc.access_code?.includes(shareCode),
                active: doc.is_active,
                expire: doc.expires_at
              });
            });
          }

          setError(`Code "${shareCode}" introuvable. Consultez les logs pour le diagnostic complet.`);
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
