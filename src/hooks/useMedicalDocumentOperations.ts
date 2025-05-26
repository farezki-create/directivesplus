
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMedicalDocumentActions } from "./useMedicalDocumentActions";

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
  const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set());

  const {
    previewDocument,
    setPreviewDocument,
    handleView,
    handleDelete: originalHandleDelete
  } = useMedicalDocumentActions({
    onDeleteComplete: () => {
      fetchDocuments();
      onUploadComplete();
    }
  });

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
    
    // Toast bref de 2 secondes
    toast({
      title: "Document ajouté",
      description: "Le document médical a été ajouté aux directives anticipées",
      duration: 2000
    });
  };

  const handleDeleteDocument = async (documentId: string) => {
    setDeletingDocuments(prev => new Set([...prev, documentId]));
    
    try {
      await originalHandleDelete();
      
      // Supprimer de la liste locale
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      if (onDocumentRemove) {
        onDocumentRemove(documentId);
      }
      
      // Rafraîchir la liste des documents
      fetchDocuments();
      
      toast({
        title: "Document supprimé",
        description: "Le document médical a été retiré des directives anticipées",
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
    } finally {
      setDeletingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const handlePreviewDocument = (document: any) => {
    console.log("Prévisualisation du document:", document);
    handleView(document.file_path, document.file_type);
  };

  const handleIncorporateDocument = (document: any) => {
    console.log("Incorporation du document:", document);
    onDocumentAdd(document);
    
    toast({
      title: "Document incorporé",
      description: "Le document sera inclus dans le PDF des directives anticipées",
      duration: 2000
    });
  };

  return {
    uploadedDocuments,
    deletingDocuments,
    previewDocument,
    setPreviewDocument,
    handleDocumentUpload,
    handleDeleteDocument,
    handlePreviewDocument,
    handleIncorporateDocument
  };
};
