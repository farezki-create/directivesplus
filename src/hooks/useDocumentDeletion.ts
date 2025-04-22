
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/components/documents/types";

export function useDocumentDeletion(
  document: Document,
  onDelete?: (documentId: string) => void
) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteDocument = async () => {
    if (!document.id || !onDelete) return;
    
    try {
      setIsDeleting(true);
      
      // First delete associated access codes
      const { error: accessCodesError } = await supabase
        .from('document_access_codes')
        .delete()
        .eq('document_id', document.id);
        
      if (accessCodesError) {
        console.error("Error deleting access codes:", accessCodesError);
        throw accessCodesError;
      }
      
      // Then delete storage file if exists
      if (document.file_path) {
        const bucket = document.file_path.split('/')[0] === document.file_path 
          ? 'directives_pdfs' 
          : document.file_path.split('/')[0];
          
        const path = document.file_path.includes('/') 
          ? document.file_path.substring(document.file_path.indexOf('/') + 1) 
          : document.file_path;
        
        const { error: storageError } = await supabase
          .storage
          .from(bucket)
          .remove([path]);
          
        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          // Continue with database deletion even if storage fails
        }
      }
      
      // Finally delete document record
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', document.id);
        
      if (dbError) {
        throw dbError;
      }
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
      
      onDelete(document.id);
      
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    handleDeleteDocument
  };
}
