
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface MedicalDocumentOperationsProps {
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
}: MedicalDocumentOperationsProps) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set());
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);

  // Récupérer les documents médicaux depuis medical_documents ET questionnaires
  useEffect(() => {
    const fetchMedicalDocuments = async () => {
      if (!userId) return;
      
      try {
        // Récupérer depuis medical_documents (nouveau système simplifié)
        const { data: medicalDocs, error: medicalError } = await supabase
          .from('medical_documents')
          .select('*')
          .eq('user_id', userId);

        let allDocuments: any[] = [];

        if (!medicalError && medicalDocs) {
          allDocuments = medicalDocs.map(doc => ({
            id: doc.id,
            name: doc.file_name,
            description: doc.description || `Document médical: ${doc.file_name}`,
            created_at: doc.created_at,
            file_path: doc.file_path,
            file_type: doc.file_type
          }));
        }

        // Récupérer aussi depuis questionnaire_responses (ancien système)
        const { data: questionnaireData, error: questionnaireError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', userId)
          .eq('questionnaire_type', 'medical-documents');
        
        if (!questionnaireError && questionnaireData) {
          const questionnaireDocuments = questionnaireData.map(item => ({
            id: item.question_id,
            name: item.question_text,
            description: item.response,
            created_at: item.created_at
          }));
          allDocuments = [...allDocuments, ...questionnaireDocuments];
        }

        setUploadedDocuments(allDocuments);
      } catch (error) {
        console.error('Erreur lors de la récupération des documents médicaux:', error);
      }
    };
    
    fetchMedicalDocuments();
  }, [userId]);

  const handleDocumentUpload = async (url: string, fileName: string) => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un document",
        variant: "destructive"
      });
      return;
    }

    try {
      // Ajouter directement dans medical_documents pour simplifier
      const { data, error } = await supabase
        .from('medical_documents')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_path: url,
          description: `Document médical de synthèse: ${fileName}`,
          file_type: url.startsWith('data:application/pdf') ? 'pdf' : 'image',
          file_size: url.length
        })
        .select()
        .single();

      if (error) throw error;

      const newDocument = {
        id: data.id,
        name: fileName,
        description: `Document médical de synthèse: ${fileName}`,
        created_at: data.created_at,
        file_path: url,
        file_type: data.file_type
      };

      setUploadedDocuments(prev => [...prev, newDocument]);
      onDocumentAdd(newDocument);
      onUploadComplete();

      // Ouvrir immédiatement le document pour incorporation dans la synthèse
      setPreviewDocument(url);

      toast({
        title: "Document ajouté et ouvert",
        description: "Le document médical a été ajouté et est maintenant ouvert pour incorporation dans votre synthèse"
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document médical",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!userId) return;

    setDeletingDocuments(prev => new Set([...prev, documentId]));

    try {
      // Supprimer de medical_documents
      const { error: medicalError } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', userId);

      // Supprimer aussi de questionnaire_responses si c'est un ancien document
      const { error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .delete()
        .eq('user_id', userId)
        .eq('questionnaire_type', 'medical-documents')
        .eq('question_id', documentId);

      setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));

      if (onDocumentRemove) {
        onDocumentRemove(documentId);
      }

      toast({
        title: "Supprimé",
        description: "Document supprimé",
        duration: 2000
      });
    } catch (error: any) {
      console.error('Erreur lors de la suppression du document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document médical",
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
    if (document.file_path) {
      setPreviewDocument(document.file_path);
    } else {
      toast({
        title: "Aperçu non disponible",
        description: "Ce document ne peut pas être prévisualisé",
        variant: "destructive"
      });
    }
  };

  const handleIncorporateDocument = (document: any) => {
    // Ouvrir le document pour incorporation
    setPreviewDocument(document.file_path);
    
    toast({
      title: "Document ouvert pour incorporation",
      description: "Le document est maintenant ouvert pour incorporation dans votre synthèse",
      duration: 3000
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
