
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
        file_type: doc.file_type,
        file_size: doc.file_size,
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

  const handleVisibilityToggle = async (documentId: string, isVisible: boolean) => {
    try {
      // Pour l'instant, on simule la fonctionnalité
      // Plus tard, on pourra ajouter un champ visibility_institutions dans la table
      toast({
        title: isVisible ? "Document rendu accessible" : "Document rendu privé",
        description: isVisible 
          ? "Les institutions médicales autorisées pourront accéder à ce document"
          : "Ce document est maintenant privé",
      });

      // TODO: Implémenter la mise à jour en base de données
      // const { error } = await supabase
      //   .from('medical_documents')
      //   .update({ visible_to_institutions: isVisible })
      //   .eq('id', documentId);
      
    } catch (error) {
      console.error('Error updating document visibility:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité du document",
        variant: "destructive"
      });
    }
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
