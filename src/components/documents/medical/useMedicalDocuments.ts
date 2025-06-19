
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MedicalDocument } from "./types";

export const useMedicalDocuments = (userId: string) => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMedicalDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading medical documents:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents médicaux",
          variant: "destructive"
        });
        return;
      }

      // Transform data to match MedicalDocument interface
      const transformedData: MedicalDocument[] = (data || []).map(doc => ({
        id: doc.id,
        file_name: doc.file_name,
        file_path: doc.file_path,
        file_type: doc.file_type || '',
        file_size: doc.file_size || 0,
        description: doc.description,
        created_at: doc.created_at,
        user_id: doc.user_id,
        extracted_content: doc.extracted_content
      }));

      setDocuments(transformedData);
    } catch (error) {
      console.error('Error loading medical documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (documentId: string, currentVisibility: boolean) => {
    // Since we simplified the interface, this is a no-op for now
    toast({
      title: "Information",
      description: "La gestion de visibilité sera disponible prochainement",
    });
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le document",
          variant: "destructive"
        });
        return;
      }

      await loadMedicalDocuments();
      toast({
        title: "Document supprimé",
        description: "Le document médical a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadMedicalDocuments();
    }
  }, [userId]);

  return {
    documents,
    loading,
    loadMedicalDocuments,
    handleVisibilityToggle,
    handleDelete
  };
};
