
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MedicalDocument } from "@/components/medical/types";

export function useMedicalDocuments(userId: string) {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching medical documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos documents médicaux",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const previewDocument = async (document: MedicalDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical_documents')
        .createSignedUrl(document.file_path, 3600);
        
      if (error) throw error;
      
      setPreviewUrl(data.signedUrl);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Error creating preview URL:", error);
      toast({
        title: "Erreur",
        description: "Impossible de prévisualiser le document",
        variant: "destructive"
      });
    }
  };
  
  const deleteDocument = async (documentId: string) => {
    try {
      // First find the document to get the file path
      const documentToDelete = documents.find(doc => doc.id === documentId);
      if (!documentToDelete) return;
      
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('medical_documents')
        .remove([documentToDelete.file_path]);
        
      if (storageError) throw storageError;
      
      // Delete the database record
      const { error: dbError } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId);
        
      if (dbError) throw dbError;
      
      // Update the local state
      setDocuments(documents.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };
  
  // Initial fetch when component mounts
  useEffect(() => {
    if (userId) {
      fetchDocuments();
    }
  }, [userId]);

  return {
    documents,
    loading,
    previewUrl,
    previewOpen,
    setPreviewOpen,
    fetchDocuments,
    previewDocument,
    deleteDocument
  };
}
