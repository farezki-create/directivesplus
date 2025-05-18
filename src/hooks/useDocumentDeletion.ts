
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UseDocumentDeletionProps {
  onDeleteComplete: () => void;
  tableName?: string; // Allow specifying different tables
}

export const useDocumentDeletion = ({ onDeleteComplete, tableName = 'pdf_documents' }: UseDocumentDeletionProps) => {
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
  const confirmDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
  };
  
  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', documentToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
      
      // Refresh the documents list
      onDeleteComplete();
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du document (${tableName}):`, error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  return {
    documentToDelete,
    setDocumentToDelete,
    confirmDelete,
    handleDelete
  };
};
