
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
      console.log("Fetching medical documents for user:", userId);
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching medical documents:", error);
        throw error;
      }
      console.log("Medical documents retrieved:", data);
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
      console.log("Creating preview URL for:", document.file_path);
      const { data, error } = await supabase.storage
        .from('medical_documents')
        .createSignedUrl(document.file_path, 3600);
        
      if (error) {
        console.error("Error creating signed URL:", error);
        throw error;
      }
      
      console.log("Generated signed URL:", data.signedUrl);
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
      if (!documentToDelete) {
        toast({
          title: "Erreur",
          description: "Document introuvable",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Deleting document:", documentToDelete.file_path);
      
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('medical_documents')
        .remove([documentToDelete.file_path]);
        
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue with database deletion even if storage deletion fails
      }
      
      // Delete the database record
      const { error: dbError } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId);
        
      if (dbError) {
        console.error("Error deleting document record:", dbError);
        throw dbError;
      }
      
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
  
  // Initial fetch when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      console.log("UserId changed, fetching medical documents");
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
