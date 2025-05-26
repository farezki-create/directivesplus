
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
      
      // Générer directement l'URL vers mes-directives avec les paramètres d'accès
      generateDirectivesUrl(user.id);
    }
  }, [user, profile]);

  const generateDirectivesUrl = async (userId: string) => {
    try {
      console.log("AccessCardGeneration - Generating directives URL for user:", userId);
      
      // Construire l'URL directe vers mes-directives avec paramètres QR
      const baseUrl = window.location.origin;
      const directivesUrl = `${baseUrl}/mes-directives?access=card&user=${userId}`;
      
      console.log("AccessCardGeneration - Generated directives URL:", {
        directivesUrl,
        baseUrl,
        userId,
        urlLength: directivesUrl.length
      });
      
      setQrCodeUrl(directivesUrl);
      
    } catch (error) {
      console.error("AccessCardGeneration - Exception during URL generation:", error);
      // URL de fallback vers mes-directives
      const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
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
