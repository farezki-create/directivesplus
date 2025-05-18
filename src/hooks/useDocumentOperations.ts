
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  file_type?: string;
  user_id: string;
  is_private?: boolean;
}

export const useDocumentOperations = (refreshDocuments: () => void) => {
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      // Pour les fichiers audio, afficher dans une boîte de dialogue
      if (filePath.includes('audio')) {
        setPreviewDocument(filePath);
        return;
      }
      
      // Pour les PDF et autres documents, télécharger et ouvrir
      const link = document.createElement('a');
      link.href = filePath;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Document ouvert",
        description: "Votre document a été ouvert dans un nouvel onglet"
      });
    } catch (error) {
      console.error("Erreur lors de l'ouverture du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (filePath: string, fileType: string = "application/pdf") => {
    try {
      if (filePath.startsWith('data:') && filePath.includes('audio')) {
        toast({
          title: "Information",
          description: "L'impression n'est pas disponible pour les fichiers audio."
        });
        return;
      }
      
      // Ouvrir le document dans un nouvel onglet pour impression
      const printWindow = window.open(filePath, '_blank');
      if (printWindow) {
        printWindow.focus();
        // Attendre que le contenu soit chargé avant d'imprimer
        printWindow.onload = () => {
          try {
            printWindow.print();
          } catch (err) {
            console.error("Erreur lors de l'impression:", err);
          }
        };
      } else {
        throw new Error("Impossible d'ouvrir une nouvelle fenêtre");
      }
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document",
        variant: "destructive"
      });
    }
  };

  const handleShare = (documentId: string) => {
    toast({
      title: "Fonctionnalité en développement",
      description: "Le partage de document sera bientôt disponible"
    });
  };
  
  const handleView = (filePath: string, fileType: string = "application/pdf") => {
    handleDownload(filePath, "document");
  };
  
  const confirmDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
  };
  
  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      const { error } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', documentToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
      
      // Rafraîchir la liste des documents
      refreshDocuments();
    } catch (error: any) {
      console.error("Erreur lors de la suppression du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  return {
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleShare,
    handleView,
    confirmDelete,
    handleDelete
  };
};
