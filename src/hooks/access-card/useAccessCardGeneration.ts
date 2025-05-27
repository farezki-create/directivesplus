
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useAccessCardGeneration = () => {
  const { user, profile } = useAuth();
  const [codeAcces, setCodeAcces] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

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
      
      // Récupérer le document des directives anticipées
      generateQRCodeForDirectives(user.id);
    }
  }, [user, profile]);

  const generateQRCodeForDirectives = async (userId: string) => {
    setIsGenerating(true);
    try {
      console.log("AccessCardGeneration - Starting QR generation for user:", userId);
      
      // 1. Rechercher le document PDF le plus récent
      const { data: pdfDocs, error: pdfError } = await supabase
        .from('pdf_documents')
        .select('id, file_name, file_path, content_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log("AccessCardGeneration - PDF search result:", {
        pdfDocs,
        pdfError,
        count: pdfDocs?.length || 0
      });

      if (!pdfError && pdfDocs && pdfDocs.length > 0) {
        const document = pdfDocs[0];
        let finalUrl = "";
        
        // Vérifier si le file_path est une URL complète ou un chemin data:
        if (document.file_path.startsWith('http')) {
          // URL directe vers le fichier
          finalUrl = document.file_path;
        } else if (document.file_path.startsWith('data:')) {
          // Data URL - créer une URL de visualisation
          finalUrl = `${window.location.origin}/pdf-viewer?id=${document.id}&direct=true`;
        } else {
          // Chemin relatif - construire l'URL complète
          finalUrl = `${window.location.origin}/pdf-viewer?id=${document.id}`;
        }
        
        console.log("AccessCardGeneration - Generated URL:", {
          originalPath: document.file_path,
          finalUrl,
          urlType: document.file_path.startsWith('http') ? 'direct' : 
                   document.file_path.startsWith('data:') ? 'data' : 'relative',
          urlLength: finalUrl.length
        });
        
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

      console.log("AccessCardGeneration - Directives search result:", {
        directives,
        directivesError,
        count: directives?.length || 0
      });

      if (!directivesError && directives && directives.length > 0) {
        const directive = directives[0];
        const directiveUrl = `${window.location.origin}/pdf-viewer?id=${directive.id}&type=directive`;
        
        console.log("AccessCardGeneration - Generated directive URL:", {
          directiveUrl,
          directiveId: directive.id
        });
        
        setQrCodeUrl(directiveUrl);
        setIsGenerating(false);
        return;
      }

      // 3. Fallback - utiliser mes-directives avec paramètre d'accès
      console.log("AccessCardGeneration - No documents found, using fallback");
      const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId.substring(0, 8)}`;
      setQrCodeUrl(fallbackUrl);
      
    } catch (error) {
      console.error("AccessCardGeneration - Error during generation:", error);
      // En cas d'erreur, utiliser une URL de fallback simple
      const fallbackUrl = `${window.location.origin}/mes-directives`;
      setQrCodeUrl(fallbackUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  // Validation robuste de l'URL générée
  const isQrCodeValid = qrCodeUrl && 
                       qrCodeUrl.trim() !== '' && 
                       qrCodeUrl.length > 20 && // URL plus longue que minimum
                       (qrCodeUrl.startsWith('http://') || qrCodeUrl.startsWith('https://')) &&
                       !isGenerating;

  console.log("AccessCardGeneration - Final validation:", {
    codeAcces,
    qrCodeUrl,
    qrCodeUrlLength: qrCodeUrl?.length || 0,
    hasUser: !!user,
    hasProfile: !!profile,
    isUrlValid: isQrCodeValid,
    isGenerating,
    origin: window.location.origin
  });

  return {
    codeAcces,
    qrCodeUrl,
    isGenerating,
    isQrCodeValid
  };
};
