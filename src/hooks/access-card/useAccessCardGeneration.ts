
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
      
      // Récupérer le document des directives anticipées pour le QR code
      fetchDirectivesDocument(user.id);
    }
  }, [user, profile]);

  const fetchDirectivesDocument = async (userId: string) => {
    try {
      const { data: documents, error } = await supabase
        .from('pdf_documents')
        .select('id, file_name')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Erreur lors de la récupération du document:", error);
        // Fallback vers l'URL d'accès direct si pas de document
        const fallbackUrl = `${window.location.origin}/direct-document?id=${userId}`;
        setQrCodeUrl(fallbackUrl);
        return;
      }

      if (documents && documents.length > 0) {
        // QR code pointant vers le document des directives anticipées
        const directiveUrl = `${window.location.origin}/direct-document?id=${documents[0].id}`;
        setQrCodeUrl(directiveUrl);
      } else {
        // Fallback vers l'URL d'accès direct si pas de document
        const fallbackUrl = `${window.location.origin}/direct-document?id=${userId}`;
        setQrCodeUrl(fallbackUrl);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du document:", error);
      // Fallback vers l'URL d'accès direct
      const fallbackUrl = `${window.location.origin}/direct-document?id=${userId}`;
      setQrCodeUrl(fallbackUrl);
    }
  };

  return {
    codeAcces,
    qrCodeUrl
  };
};
