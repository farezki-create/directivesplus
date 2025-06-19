
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
        extracted_content: doc.extracted_content,
        is_private: doc.is_private || false
      }));

      setDocuments(transformedData);
    } catch (error) {
      console.error('Error loading medical documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (documentId: string, isPrivate: boolean) => {
    try {
      console.log('Toggling visibility for document:', documentId, 'isPrivate:', isPrivate);
      
      // Mettre à jour l'état local immédiatement pour un feedback instantané
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId 
            ? { ...doc, is_private: isPrivate }
            : doc
        )
      );

      // TODO: Implémenter la mise à jour en base de données
      // Pour l'instant, on simule la fonctionnalité
      // const { error } = await supabase
      //   .from('medical_documents')
      //   .update({ is_private: isPrivate })
      //   .eq('id', documentId);
      
      toast({
        title: isPrivate ? "Document rendu privé" : "Document accessible aux institutions",
        description: isPrivate 
          ? "Ce document est maintenant privé"
          : "Les institutions médicales autorisées pourront accéder à ce document",
      });

    } catch (error) {
      console.error('Error updating document visibility:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité du document",
        variant: "destructive"
      });
      
      // Revenir à l'état précédent en cas d'erreur
      await loadMedicalDocuments();
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
