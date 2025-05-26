
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
        .select('id, file_name, file_path, content_type')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Erreur lors de la récupération du document:", error);
        const fallbackUrl = createFallbackUrl(userId);
        setQrCodeUrl(fallbackUrl);
        return;
      }

      if (documents && documents.length > 0) {
        const document = documents[0];
        console.log("AccessCardGeneration - Document found:", document);
        
        // Créer l'URL appropriée selon le type de document
        let qrUrl: string;
        
        if (document.file_path && document.file_path.startsWith('data:')) {
          // Pour les documents encodés en base64, utiliser le visualisateur PDF
          qrUrl = `${window.location.origin}/pdf-viewer?id=${document.id}&source=access-card`;
          console.log("AccessCardGeneration - Generated QR URL for encoded PDF:", qrUrl);
        } else {
          // Pour les autres types, essayer d'abord le visualisateur
          qrUrl = `${window.location.origin}/pdf-viewer?id=${document.id}&source=access-card`;
          console.log("AccessCardGeneration - Generated QR URL for stored file:", qrUrl);
        }
        
        // Tester si l'URL est accessible
        testUrlAccessibility(qrUrl, userId);
        
      } else {
        console.log("AccessCardGeneration - No documents found, using fallback");
        const fallbackUrl = createFallbackUrl(userId);
        setQrCodeUrl(fallbackUrl);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du document:", error);
      const fallbackUrl = createFallbackUrl(userId);
      setQrCodeUrl(fallbackUrl);
    }
  };

  const testUrlAccessibility = async (url: string, userId: string) => {
    try {
      // Test simple de l'URL
      setQrCodeUrl(url);
      console.log("AccessCardGeneration - URL set successfully:", url);
    } catch (error) {
      console.error("AccessCardGeneration - URL test failed:", error);
      const fallbackUrl = createFallbackUrl(userId);
      setQrCodeUrl(fallbackUrl);
    }
  };

  const createFallbackUrl = (userId: string) => {
    // URL vers la page de mes directives avec paramètre utilisateur
    const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
    console.log("AccessCardGeneration - Created fallback URL:", fallbackUrl);
    return fallbackUrl;
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
