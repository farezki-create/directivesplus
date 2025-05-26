
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/types/documents";

export const useMedicalDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('medical_documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Erreur lors du chargement des documents médicaux:", error);
          setDocuments([]);
        } else {
          const transformedDocuments: Document[] = (data || []).map(doc => ({
            ...doc,
            file_type: doc.file_type || 'pdf',
            content_type: doc.file_type || 'application/pdf'
          }));
          setDocuments(transformedDocuments);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des documents médicaux:", error);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [user]);

  const handleUploadComplete = () => {
    window.location.reload();
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast({
        title: "Document supprimé",
        description: "Le document médical a été supprimé avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du document médical:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document médical",
        variant: "destructive"
      });
    }
  };

  return {
    documents,
    setDocuments,
    isLoading,
    handleUploadComplete,
    handleDelete
  };
};
