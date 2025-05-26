
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
      
      // Récupérer le premier document de l'utilisateur pour générer l'URL QR
      generateDocumentQRUrl(user.id);
    }
  }, [user, profile]);

  const generateDocumentQRUrl = async (userId: string) => {
    try {
      console.log("AccessCardGeneration - Fetching user documents for QR:", userId);
      
      // Récupérer le premier document PDF de l'utilisateur
      const { data: documents, error } = await supabase
        .from('pdf_documents')
        .select('id, file_name, file_path, content_type')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log("AccessCardGeneration - Documents query result:", {
        documents,
        error,
        documentsCount: documents?.length || 0
      });

      if (error) {
        console.error("AccessCardGeneration - Error fetching documents:", error);
        throw error;
      }

      if (documents && documents.length > 0) {
        const document = documents[0];
        // URL directe vers le visualiseur PDF avec paramètres d'accès QR
        const documentUrl = `${window.location.origin}/pdf-viewer?id=${document.id}&access=card&user=${userId}`;
        
        console.log("AccessCardGeneration - Generated QR URL for document:", {
          documentUrl,
          documentId: document.id,
          fileName: document.file_name,
          urlLength: documentUrl.length
        });
        
        setQrCodeUrl(documentUrl);
      } else {
        console.log("AccessCardGeneration - No documents found, creating fallback message");
        // Pas de documents, URL vers une page d'information
        const infoUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}&info=no-documents`;
        setQrCodeUrl(infoUrl);
      }
      
    } catch (error) {
      console.error("AccessCardGeneration - Exception during document URL generation:", error);
      // URL de fallback vers mes-directives avec message d'erreur
      const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}&error=generation`;
      console.log("AccessCardGeneration - Using fallback URL:", fallbackUrl);
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
