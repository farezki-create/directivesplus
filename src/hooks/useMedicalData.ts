
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { showErrorToast, showSuccessToast } from "@/utils/access";

interface MedicalDocument {
  id: string;
  created_at: string;
  user_id: string;
  file_name: string;
  file_path: string;
  description?: string;
  file_type?: string;
  is_private?: boolean;
}

export const useMedicalData = (userId?: string | null) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  
  const actualUserId = userId || user?.id;
  
  useEffect(() => {
    if (actualUserId) {
      fetchDocuments();
    } else {
      setLoading(false);
      setDocuments([]);
    }
  }, [actualUserId]);
  
  const fetchDocuments = async () => {
    if (!actualUserId) {
      console.log("No user ID provided for medical data fetch");
      setDocuments([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log(`Fetching medical documents for user ${actualUserId}`);
      
      const { data, error } = await supabase
        .from("medical_documents")
        .select("*")
        .eq("user_id", actualUserId)
        .order("created_at", { ascending: false });
        
      if (error) {
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} medical documents`);
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching medical documents:", error);
      showErrorToast("Erreur", "Impossible de récupérer vos données médicales");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadComplete = (document: MedicalDocument) => {
    setDocuments(prev => [document, ...prev]);
    showSuccessToast("Document ajouté", "Votre document médical a été ajouté avec succès");
  };
  
  const handleDeleteDocument = async (documentId: string) => {
    try {
      // Delete document from storage
      const documentToDelete = documents.find(doc => doc.id === documentId);
      if (documentToDelete?.file_path) {
        const { error: storageError } = await supabase.storage
          .from("medical_documents")
          .remove([documentToDelete.file_path.split('/').pop() || '']);
          
        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
        }
      }
      
      // Delete document record from database
      const { error } = await supabase
        .from("medical_documents")
        .delete()
        .eq("id", documentId);
        
      if (error) {
        throw error;
      }
      
      // Update state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      showSuccessToast("Document supprimé", "Votre document médical a été supprimé avec succès");
      
      return true;
    } catch (error) {
      console.error("Error deleting medical document:", error);
      showErrorToast("Erreur", "Impossible de supprimer le document médical");
      return false;
    }
  };
  
  return {
    documents,
    loading,
    fetchDocuments,
    handleUploadComplete,
    handleDeleteDocument
  };
};

export default useMedicalData;
