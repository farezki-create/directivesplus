
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
      console.log("Suppression du document:", documentId);
      
      // Delete from medical_documents only (simplified)
      const { error: medicalError } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', userId);

      if (medicalError) {
        console.error("Erreur lors de la suppression:", medicalError);
        throw medicalError;
      }

      // Update the UI immediately
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));

      if (onDocumentRemove) {
        onDocumentRemove(documentId);
      }

      toast({
        title: "Supprimé",
        description: "Document supprimé avec succès",
        duration: 2000
      });
      
      console.log("Document supprimé avec succès");
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
