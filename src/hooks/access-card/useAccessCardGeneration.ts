
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

  const generateDirectivesUrl = (userId: string) => {
    try {
      console.log("AccessCardGeneration - Generating directives URL for user:", userId);
      
      // URL simple vers la page mes-directives avec paramètres d'accès
      const directivesUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
      
      console.log("AccessCardGeneration - Generated URL:", directivesUrl);
      setQrCodeUrl(directivesUrl);
      
    } catch (error) {
      console.error("AccessCardGeneration - Error generating URL:", error);
      // URL de fallback vers mes-directives
      const fallbackUrl = `${window.location.origin}/mes-directives`;
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
