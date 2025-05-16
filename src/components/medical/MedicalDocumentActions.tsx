import { toast } from "@/hooks/use-toast";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  user_id: string;
}

interface MedicalDocumentActionsProps {
  onDeleteComplete: () => void;
}

export const useMedicalDocumentActions = ({ onDeleteComplete }: MedicalDocumentActionsProps) => {
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      // Pour les fichiers audio, afficher dans une boîte de dialogue
      if (filePath.includes('audio')) {
        setPreviewDocument(filePath);
        return;
      }
      
      // Si c'est un data URI (base64)
      if (filePath.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Téléchargement réussi",
          description: "Votre document a été téléchargé avec succès"
        });
        return;
      }
      
      // Pour les PDF et autres documents, télécharger et ouvrir
      const link = document.createElement('a');
      link.href = filePath;
      link.target = '_blank';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Document téléchargé",
        description: "Votre document a été téléchargé avec succès"
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (filePath: string, contentType: string = "application/pdf") => {
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
  
  const handleView = (filePath: string, contentType: string = "application/pdf") => {
    handleDownload(filePath, "document");
  };
  
  const confirmDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
  };
  
  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
      
      // Rafraîchir la liste des documents
      onDeleteComplete();
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
    documentToDelete,
    setDocumentToDelete,
    previewDocument,
    setPreviewDocument,
    handleDownload,
    handlePrint,
    handleShare,
    handleView,
    confirmDelete,
    handleDelete
  };
};

const MedicalDocumentActions = ({
  documentToDelete,
  setDocumentToDelete,
  previewDocument,
  setPreviewDocument,
  handleDelete
}: ReturnType<typeof useMedicalDocumentActions>) => {
  return (
    <>
      <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DocumentPreviewDialog 
        filePath={previewDocument} 
        onOpenChange={() => setPreviewDocument(null)} 
      />
    </>
  );
};

export default MedicalDocumentActions;
