import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface MedicalDocument {
  id: string;
  name: string;
  description: string;
  created_at: string;
  file_path?: string;
  file_type?: string;
}

interface UseMedicalDocumentOperationsProps {
  userId?: string;
  onDocumentAdd: (documentInfo: any) => void;
  onDocumentRemove?: (documentId: string) => void;
  onUploadComplete: () => void;
}

export const useMedicalDocumentOperations = ({
  userId,
  onDocumentAdd,
  onDocumentRemove,
  onUploadComplete
}: UseMedicalDocumentOperationsProps) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<MedicalDocument[]>([]);
  const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Fetch medical documents from both medical_documents and questionnaires
  useEffect(() => {
    const fetchMedicalDocuments = async () => {
      if (!userId) return;
      
      try {
        // Fetch from medical_documents (new simplified system)
        const { data: medicalDocs, error: medicalError } = await supabase
          .from('medical_documents')
          .select('*')
          .eq('user_id', userId);

        let allDocuments: MedicalDocument[] = [];

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

        // Also fetch from questionnaire_responses (old system)
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

    // Éviter les doublons en vérifiant si on est déjà en train de traiter
    if (isProcessing) {
      console.log("Upload déjà en cours, ignorer cette tentative");
      return;
    }

    try {
      setIsProcessing(true);
      
      // Calculate approximate file size from data URL
      const base64Length = url.length;
      const estimatedSize = Math.round((base64Length * 3) / 4);

      // Add directly to medical_documents to simplify
      const { data, error } = await supabase
        .from('medical_documents')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_path: url,
          description: `Document médical de synthèse: ${fileName}`,
          file_type: url.startsWith('data:application/pdf') ? 'pdf' : 'image',
          file_size: estimatedSize
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

      // Mettre à jour la liste une seule fois
      setUploadedDocuments(prev => {
        // Vérifier si le document n'existe pas déjà pour éviter les doublons
        const exists = prev.some(doc => doc.id === newDocument.id);
        if (exists) {
          return prev;
        }
        return [...prev, newDocument];
      });

      // Appeler les callbacks une seule fois
      onDocumentAdd(newDocument);
      
      toast({
        title: "Document ajouté",
        description: "Le document médical a été ajouté avec succès. Utilisez le bouton 'Voir' pour le prévisualiser."
      });

      // Notifier la fin de l'upload immédiatement
      onUploadComplete();
      setIsProcessing(false);

    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document médical",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!userId) return;

    setDeletingDocuments(prev => new Set([...prev, documentId]));

    try {
      // Delete from medical_documents
      const { error: medicalError } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', userId);

      // Also delete from questionnaire_responses if it's an old document
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

  const handlePreviewDocument = (document: MedicalDocument) => {
    if (document.file_path) {
      window.open(document.file_path, '_blank');
    } else {
      toast({
        title: "Aperçu non disponible",
        description: "Ce document ne peut pas être prévisualisé",
        variant: "destructive"
      });
    }
  };

  return {
    uploadedDocuments,
    deletingDocuments,
    handleDocumentUpload,
    handleDeleteDocument,
    handlePreviewDocument
  };
};
