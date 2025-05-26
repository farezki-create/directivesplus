
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useAccessCardGeneration = () => {
  const { user, profile } = useAuth();
  const [codeAcces, setCodeAcces] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (user && profile) {
      // Générer un code d'accès institution basé sur l'ID utilisateur
      const generatedCode = `DA${user.id.substring(0, 8).toUpperCase()}`;
      setCodeAcces(generatedCode);
      
      console.log("AccessCardGeneration - Generating for user:", {
        userId: user.id,
        profile: profile,
        generatedCode
      });
      
      // Récupérer le premier document de l'utilisateur pour générer l'URL
      generateDocumentUrl(user.id);
    }
  }, [user, profile]);

  const generateDocumentUrl = async (userId: string) => {
    try {
      console.log("AccessCardGeneration - Fetching documents for user:", userId);
      
      // Récupérer le premier document PDF de l'utilisateur avec plus de détails
      const { data: documents, error } = await supabase
        .from('pdf_documents')
        .select('id, file_name, file_path')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log("AccessCardGeneration - Documents query result:", {
        documents,
        error,
        userId
      });

      if (error) {
        console.error("AccessCardGeneration - Error fetching documents:", error);
        // URL de fallback vers mes-directives avec paramètres d'accès
        const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
        console.log("AccessCardGeneration - Using fallback URL:", fallbackUrl);
        setQrCodeUrl(fallbackUrl);
        return;
      }

      if (documents && documents.length > 0) {
        const document = documents[0];
        // URL directe vers le visualiseur PDF du premier document avec paramètres QR
        const documentUrl = `${window.location.origin}/pdf-viewer?id=${document.id}&access=card&user=${userId}`;
        console.log("AccessCardGeneration - Generated document URL:", {
          documentUrl,
          documentId: document.id,
          fileName: document.file_name
        });
        setQrCodeUrl(documentUrl);
      } else {
        console.log("AccessCardGeneration - No documents found, using directives fallback");
        // Pas de documents, utiliser l'URL vers les directives
        const directivesUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
        setQrCodeUrl(directivesUrl);
      }
      
    } catch (error) {
      console.error("AccessCardGeneration - Exception during URL generation:", error);
      // URL de fallback vers mes-directives
      const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
      setQrCodeUrl(fallbackUrl);
    }
  };

  // Validation et debug de l'URL générée
  const isQrCodeValid = qrCodeUrl && 
                       qrCodeUrl.trim() !== '' && 
                       (qrCodeUrl.startsWith('http://') || qrCodeUrl.startsWith('https://'));

  console.log("AccessCardGeneration - Final state:", {
    codeAcces,
    qrCodeUrl,
    qrCodeUrlLength: qrCodeUrl?.length || 0,
    hasUser: !!user,
    hasProfile: !!profile,
    isUrlValid: isQrCodeValid,
    origin: window.location.origin
  });

  return {
    codeAcces,
    qrCodeUrl
  };
};
