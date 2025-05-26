
import { useState } from "react";
import { useDocumentVisibility } from "./useDocumentVisibility";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentPrint } from "./useDocumentPrint";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UseMedicalDocumentActionsProps {
  onDeleteComplete: () => void;
}

export const useMedicalDocumentActions = ({ onDeleteComplete }: UseMedicalDocumentActionsProps) => {
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
  const { handleVisibilityChange } = useDocumentVisibility();
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();

  const handleView = (filePath: string, fileType?: string) => {
    console.log("useMedicalDocumentActions - handleView:", filePath);
    setPreviewDocument(filePath);
  };

  const confirmDelete = (documentId: string) => {
    console.log("useMedicalDocumentActions - confirmDelete:", documentId);
    setDocumentToDelete(documentId);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    console.log("useMedicalDocumentActions - handleDelete appelé pour:", documentToDelete);
    
    try {
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentToDelete);

      if (error) throw error;

      toast({
        title: "Document supprimé",
        description: "Le document médical a été supprimé avec succès"
      });

      onDeleteComplete();
    } catch (error) {
      console.error("Erreur lors de la suppression du document médical:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document médical",
        variant: "destructive"
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  console.log("useMedicalDocumentActions - état actuel:", {
    previewDocument,
    documentToDelete
  });

  return {
    documentToDelete,
    setDocumentToDelete,
    previewDocument,
    setPreviewDocument,
    handleDownload,
    handlePrint,
    handleView,
    confirmDelete,
    handleDelete,
    handleVisibilityChange
  };
};
