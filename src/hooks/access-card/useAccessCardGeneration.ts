
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getPublicAppUrl } from "@/utils/getPublicAppUrl";

export const useAccessCardGeneration = () => {
  const { user, profile } = useAuth();
  const [codeAcces, setCodeAcces] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const generatedCode = `DA${user.id.substring(0, 8).toUpperCase()}`;
      setCodeAcces(generatedCode);
      generateQRCodeForDirectives(user.id, generatedCode);
    }
  }, [user, profile]);

  const generateQRCodeForDirectives = async (userId: string, accessCode: string) => {
    setIsGenerating(true);
    const baseUrl = getPublicAppUrl();
    try {
      // 1. Rechercher le document PDF le plus récent
      const { data: pdfDocs, error: pdfError } = await supabase
        .from('pdf_documents')
        .select('id, file_name, file_path, content_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!pdfError && pdfDocs && pdfDocs.length > 0) {
        const document = pdfDocs[0];
        let finalUrl = "";
        
        if (document.file_path.startsWith('http')) {
          finalUrl = document.file_path;
        } else if (document.file_path.startsWith('data:')) {
          finalUrl = `${baseUrl}/pdf-viewer/${document.id}`;
        } else {
          finalUrl = `${baseUrl}/pdf-viewer/${document.id}`;
        }
        
        setQrCodeUrl(finalUrl);
        setIsGenerating(false);
        return;
      }

      // 2. Si pas de PDF, chercher dans les directives JSON
      const { data: directives, error: directivesError } = await supabase
        .from('directives')
        .select('id, content, created_at')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!directivesError && directives && directives.length > 0) {
        const directive = directives[0];
        const directiveUrl = `${baseUrl}/pdf-viewer/${directive.id}?type=directive`;
        setQrCodeUrl(directiveUrl);
        setIsGenerating(false);
        return;
      }

      // 3. Fallback amélioré
      const fallbackUrl = `${baseUrl}/mes-directives?access=emergency&code=${accessCode}`;
      setQrCodeUrl(fallbackUrl);
      
    } catch (error) {
      console.error("AccessCardGeneration - Error during generation:", error);
      const errorFallbackUrl = `${baseUrl}/directives-access?emergency=true&user=${userId.substring(0, 8)}`;
      setQrCodeUrl(errorFallbackUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  const isQrCodeValid = qrCodeUrl && 
                       qrCodeUrl.trim() !== '' && 
                       qrCodeUrl.length > 10 &&
                       (qrCodeUrl.startsWith('http://') || qrCodeUrl.startsWith('https://')) &&
                       !isGenerating;

  return {
    codeAcces,
    qrCodeUrl,
    isGenerating,
    isQrCodeValid
  };
};
