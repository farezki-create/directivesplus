
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

interface UseMedicalDocumentActionsProps {
  userId?: string;
  deletingDocuments: Set<string>;
  setDeletingDocuments: React.Dispatch<React.SetStateAction<Set<string>>>;
  setUploadedDocuments: React.Dispatch<React.SetStateAction<MedicalDocument[]>>;
  onDocumentRemove?: (documentId: string) => void;
}

export const useMedicalDocumentActions = ({
  userId,
  deletingDocuments,
  setDeletingDocuments,
  setUploadedDocuments,
  onDocumentRemove
}: UseMedicalDocumentActionsProps) => {

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
    handleDeleteDocument,
    handlePreviewDocument
  };
};
