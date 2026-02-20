
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
        const { allSharedDocs } = await runComprehensiveDiagnostics(shareCode);
        await checkProfilesTable(shareCode);
        
        const { exactMatch } = await searchExactMatch(shareCode);
        const { accessCodes } = await searchAccessCodes(shareCode);
        
        await testRpcFunction(shareCode);
        await runExplicitTableSearches(shareCode);

        if (exactMatch && exactMatch.length > 0) {
          const documentData = exactMatch[0];
          const transformedDocument = transformSharedDocument(documentData);
          setSharedDocument(transformedDocument);
          
          toast({
            title: "Document trouvé",
            description: "Accès autorisé au document partagé",
          });
        } else if (accessCodes && accessCodes.length > 0) {
          const { docData, docError } = await getAssociatedDocument(accessCodes[0].document_id);

          if (docData && !docError) {
            const transformedDocument = transformFromAccessCode(docData, accessCodes[0]);
            setSharedDocument(transformedDocument);
            
            toast({
              title: "Document trouvé",
              description: "Accès autorisé via code d'accès",
            });
          } else {
            setError("Document associé introuvable");
          }
        } else {
          if (allSharedDocs) {
            runFinalDiagnostic(shareCode, allSharedDocs);
          }
          setError(`Code "${shareCode}" introuvable. Consultez les logs pour le diagnostic complet.`);
        }

      } catch (err) {
        console.error("Erreur lors du diagnostic:", err);
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
