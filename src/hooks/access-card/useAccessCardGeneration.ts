
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
      
      // Récupérer le document PDF des directives anticipées
      generateDirectivesDocumentUrl(user.id);
    }
  }, [user, profile]);

  const generateDirectivesDocumentUrl = async (userId: string) => {
    try {
      console.log("AccessCardGeneration - Searching for directives document:", userId);
      
      // D'abord chercher dans les directives (format JSON)
      const { data: directives, error: directivesError } = await supabase
        .from('directives')
        .select('id, content, created_at')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log("AccessCardGeneration - Directives found:", {
        directives,
        directivesError,
        count: directives?.length || 0
      });

      if (!directivesError && directives && directives.length > 0) {
        const directive = directives[0];
        // URL vers le visualisateur de directive spécifique
        const directiveUrl = `${window.location.origin}/pdf-viewer?id=${directive.id}&type=directive&access=card&user=${userId}`;
        
        console.log("AccessCardGeneration - Generated directive URL:", {
          directiveUrl,
          directiveId: directive.id,
          urlLength: directiveUrl.length
        });
        
        setQrCodeUrl(directiveUrl);
        return;
      }

      // Chercher dans les documents PDF
      const { data: pdfDocs, error: pdfError } = await supabase
        .from('pdf_documents')
        .select('id, file_name, file_path, content_type')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log("AccessCardGeneration - PDF documents found:", {
        pdfDocs,
        pdfError,
        count: pdfDocs?.length || 0
      });

      if (!pdfError && pdfDocs && pdfDocs.length > 0) {
        const document = pdfDocs[0];
        // URL vers le visualisateur PDF
        const documentUrl = `${window.location.origin}/pdf-viewer?id=${document.id}&type=pdf&access=card&user=${userId}`;
        
        console.log("AccessCardGeneration - Generated PDF URL:", {
          documentUrl,
          documentId: document.id,
          fileName: document.file_name,
          urlLength: documentUrl.length
        });
        
        setQrCodeUrl(documentUrl);
        return;
      }

      // Aucun document trouvé - fallback vers mes-directives
      console.log("AccessCardGeneration - No documents found, using fallback");
      const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}&info=no-documents`;
      setQrCodeUrl(fallbackUrl);
      
    } catch (error) {
      console.error("AccessCardGeneration - Error generating document URL:", error);
      const fallbackUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}&error=generation`;
      setQrCodeUrl(fallbackUrl);
    }
  };

  // Validation de l'URL générée
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
