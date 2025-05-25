
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

interface UseMedicalDocumentUploadProps {
  userId?: string;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  setUploadedDocuments: React.Dispatch<React.SetStateAction<MedicalDocument[]>>;
  onDocumentAdd: (documentInfo: any) => void;
  onUploadComplete: () => void;
}

export const useMedicalDocumentUpload = ({
  userId,
  isProcessing,
  setIsProcessing,
  setUploadedDocuments,
  onDocumentAdd,
  onUploadComplete
}: UseMedicalDocumentUploadProps) => {
  
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

  return { handleDocumentUpload };
};
