
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
      
      // Récupérer le document des directives anticipées pour le QR code
      fetchDirectivesDocument(user.id);
    }
  }, [user, profile]);

  const fetchDirectivesDocument = async (userId: string) => {
    try {
      console.log("AccessCardGeneration - Fetching documents for user:", userId);
      
      const { data: documents, error } = await supabase
        .from('pdf_documents')
        .select('id, file_name, file_path')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Erreur lors de la récupération du document:", error);
        // Fallback vers l'URL d'accès direct avec les infos du profil
        const fallbackUrl = createFallbackUrl(userId);
        setQrCodeUrl(fallbackUrl);
        return;
      }

      if (documents && documents.length > 0) {
        const document = documents[0];
        console.log("AccessCardGeneration - Document found:", document);
        
        // QR code pointant vers le visualisateur PDF avec l'ID du document
        const directiveUrl = `${window.location.origin}/pdf-viewer?id=${document.id}`;
        console.log("AccessCardGeneration - Generated QR URL:", directiveUrl);
        setQrCodeUrl(directiveUrl);
      } else {
        console.log("AccessCardGeneration - No documents found, using fallback");
        // Fallback vers l'URL d'accès direct
        const fallbackUrl = createFallbackUrl(userId);
        setQrCodeUrl(fallbackUrl);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du document:", error);
      // Fallback vers l'URL d'accès direct
      const fallbackUrl = createFallbackUrl(userId);
      setQrCodeUrl(fallbackUrl);
    }
  };

  const createFallbackUrl = (userId: string) => {
    // URL vers la page d'accès aux directives avec l'ID utilisateur
    return `${window.location.origin}/mes-directives`;
  };

  console.log("AccessCardGeneration - Current state:", {
    codeAcces,
    qrCodeUrl,
    hasUser: !!user,
    hasProfile: !!profile
  });

  return {
    codeAcces,
    qrCodeUrl
  };
};
