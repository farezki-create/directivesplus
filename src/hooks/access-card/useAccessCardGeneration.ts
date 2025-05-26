
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
      
      // Récupérer le premier document PDF de l'utilisateur
      const { data: documents, error } = await supabase
        .from('pdf_documents')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error("AccessCardGeneration - Error fetching documents:", error);
        // URL de fallback vers mes-directives
        const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
        setQrCodeUrl(fallbackUrl);
        return;
      }

      if (documents && documents.length > 0) {
        // URL directe vers le visualiseur PDF du premier document
        const documentUrl = `${window.location.origin}/pdf-viewer?id=${documents[0].id}&access=card&user=${userId}`;
        console.log("AccessCardGeneration - Generated document URL:", documentUrl);
        setQrCodeUrl(documentUrl);
      } else {
        console.log("AccessCardGeneration - No documents found, using fallback URL");
        // Pas de documents, utiliser l'URL de fallback
        const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
        setQrCodeUrl(fallbackUrl);
      }
      
    } catch (error) {
      console.error("AccessCardGeneration - Error generating URL:", error);
      // URL de fallback vers mes-directives
      const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
      setQrCodeUrl(fallbackUrl);
    }
  };

  console.log("AccessCardGeneration - Current state:", {
    codeAcces,
    qrCodeUrl,
    qrCodeUrlLength: qrCodeUrl?.length || 0,
    hasUser: !!user,
    hasProfile: !!profile,
    isUrlValid: qrCodeUrl && qrCodeUrl.startsWith('http')
  });

  return {
    codeAcces,
    qrCodeUrl
  };
};
