
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseMedicalDocumentOperationsProps {
  userId?: string;
  onUploadComplete: () => void;
  onDocumentAdd: (documentInfo: any) => void;
  onDocumentRemove?: (documentId: string) => void;
}

export const useMedicalDocumentOperations = ({ 
  userId, 
  onUploadComplete, 
  onDocumentAdd, 
  onDocumentRemove 
}: UseMedicalDocumentOperationsProps) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploadedDocuments(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const handleDocumentUpload = async (documentInfo: any) => {
    console.log("Document médical téléchargé:", documentInfo);
    
    // Ajouter le document à la liste locale
    setUploadedDocuments(prev => [documentInfo, ...prev]);
    
    // Informer le parent
    onDocumentAdd(documentInfo);
    onUploadComplete();
    
    toast({
      title: "Document ajouté",
      description: "Le contenu du document médical sera affiché ci-dessous et intégré dans vos directives anticipées",
      duration: 2000
    });
  };

  const handleDeleteDocument = async (documentId: string) => {
    console.log("Suppression du document:", documentId);
    
    try {
      // Supprimer de la base de données
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      
      console.log("Document supprimé de la base:", documentId);
      
      // Supprimer de la liste locale
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      if (onDocumentRemove) {
        onDocumentRemove(documentId);
      }
      
      toast({
        title: "Document retiré",
        description: "Le document médical a été retiré de vos directives anticipées",
        duration: 2000
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
        duration: 2000
      });
      
      // En cas d'erreur, recharger la liste
      fetchDocuments();
    }
  };

  return {
    uploadedDocuments,
    previewDocument,
    setPreviewDocument,
    handleDocumentUpload,
    handleDeleteDocument
  };
};
