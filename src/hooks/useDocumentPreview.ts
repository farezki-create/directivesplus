
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/components/documents/types";

export function useDocumentPreview() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const handlePreviewDocument = async (doc: Document) => {
    try {
      const fileUrl = doc.file_path.startsWith('http') 
        ? doc.file_path 
        : (await supabase.storage.from('directives_pdfs').createSignedUrl(doc.file_path, 3600)).data?.signedUrl;
      
      if (!fileUrl) {
        throw new Error("Impossible de récupérer l'URL du document");
      }
      
      setPreviewUrl(fileUrl);
      setSelectedDocumentId(doc.id);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error getting document preview URL:", error);
      toast({
        title: "Erreur",
        description: "Impossible de prévisualiser le document",
        variant: "destructive",
      });
    }
  };

  return {
    selectedDocumentId,
    previewUrl,
    isPreviewOpen,
    setIsPreviewOpen,
    handlePreviewDocument
  };
}
