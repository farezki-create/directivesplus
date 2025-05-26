
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
      
      // D'abord, essayer de récupérer un document PDF existant
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
        
        // Vérifier que le document est accessible
        await testDocumentAccessibility(document.id, userId);
        
      } else {
        console.log("AccessCardGeneration - No PDF documents found, checking directives...");
        
        // Si pas de PDF, vérifier s'il y a des directives dans la table directives
        const { data: directives, error: directivesError } = await supabase
          .from('directives')
          .select('id, content, created_at')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (directivesError) {
          console.error("Erreur lors de la récupération des directives:", directivesError);
          const fallbackUrl = createFallbackUrl(userId);
          setQrCodeUrl(fallbackUrl);
          return;
        }

        if (directives && directives.length > 0) {
          console.log("AccessCardGeneration - Directives found, using mes-directives page");
          // Si on a des directives mais pas de PDF, pointer vers la page mes-directives
          const directivesUrl = `${window.location.origin}/mes-directives?access=card&user=${userId}`;
          setQrCodeUrl(directivesUrl);
        } else {
          console.log("AccessCardGeneration - No content found, using fallback");
          const fallbackUrl = createFallbackUrl(userId);
          setQrCodeUrl(fallbackUrl);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du document:", error);
      const fallbackUrl = createFallbackUrl(userId);
      setQrCodeUrl(fallbackUrl);
    }
  };

  const testDocumentAccessibility = async (documentId: string, userId: string) => {
    try {
      console.log("AccessCardGeneration - Testing document accessibility:", documentId);
      
      // Tester l'accès au document via l'API
      const { data: testDoc, error: testError } = await supabase
        .from('pdf_documents')
        .select('id, file_name, file_path')
        .eq('id', documentId)
        .eq('user_id', userId)
        .single();

      if (testError || !testDoc) {
        console.error("AccessCardGeneration - Document not accessible:", testError);
        const fallbackUrl = createFallbackUrl(userId);
        setQrCodeUrl(fallbackUrl);
        return;
      }

      // Si le document est accessible, créer l'URL du visualisateur
      const pdfViewerUrl = `${window.location.origin}/pdf-viewer?id=${documentId}&source=access-card`;
      console.log("AccessCardGeneration - Document is accessible, setting URL:", pdfViewerUrl);
      setQrCodeUrl(pdfViewerUrl);
      
    } catch (error) {
      console.error("AccessCardGeneration - Error testing document accessibility:", error);
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
