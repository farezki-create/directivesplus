
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { SharedDocument } from "./shared-document/sharedDocumentTypes";
import { 
  runComprehensiveDiagnostics,
  checkProfilesTable,
  testRpcFunction,
  runExplicitTableSearches,
  runFinalDiagnostic
} from "./shared-document/sharedDocumentDiagnostics";
import {
  searchExactMatch,
  searchAccessCodes,
  getAssociatedDocument
} from "./shared-document/sharedDocumentQueries";
import {
  transformSharedDocument,
  transformFromAccessCode
} from "./shared-document/sharedDocumentTransformers";

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
        // Run comprehensive diagnostics
        const { allSharedDocs } = await runComprehensiveDiagnostics(shareCode);
        await checkProfilesTable(shareCode);
        
        // Search for exact matches
        const { exactMatch } = await searchExactMatch(shareCode);
        const { accessCodes } = await searchAccessCodes(shareCode);
        
        // Test RPC function
        await testRpcFunction(shareCode);
        
        // Run explicit table searches
        await runExplicitTableSearches(shareCode);

        // Process results
        if (exactMatch && exactMatch.length > 0) {
          const documentData = exactMatch[0];
          console.log("✅ Document trouvé dans shared_documents:", documentData);

          const transformedDocument = transformSharedDocument(documentData);
          setSharedDocument(transformedDocument);
          
          toast({
            title: "Document trouvé",
            description: "Accès autorisé au document partagé",
          });
        } else if (accessCodes && accessCodes.length > 0) {
          console.log("✅ Code trouvé dans document_access_codes:", accessCodes[0]);
          
          // Get associated document
          const { docData, docError } = await getAssociatedDocument(accessCodes[0].document_id);

          if (docData && !docError) {
            const transformedDocument = transformFromAccessCode(docData, accessCodes[0]);
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
          
          // Run final diagnostic
          if (allSharedDocs) {
            runFinalDiagnostic(shareCode, allSharedDocs);
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
