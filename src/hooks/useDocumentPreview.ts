
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
      console.log("Preparing document preview:", doc);
      let fileUrl;
      
      // Check if the file_path is already a signed URL
      if (doc.file_path.startsWith('http')) {
        fileUrl = doc.file_path;
      } else {
        const bucketName = 'directives_pdfs';
        const path = doc.file_path;
          
        console.log("Creating signed URL for:", path, "in bucket:", bucketName);
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(path, 3600);
          
        if (error) {
          console.error("Error creating signed URL:", error);
          throw new Error("Impossible de récupérer l'URL du document");
        }
        
        fileUrl = data.signedUrl;
      }
      
      if (!fileUrl) {
        throw new Error("Impossible de récupérer l'URL du document");
      }
      
      console.log("Document preview URL created:", fileUrl);
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
