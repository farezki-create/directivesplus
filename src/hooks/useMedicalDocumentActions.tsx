
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseMedicalDocumentActionsProps {
  onDeleteComplete: () => void;
}

export const useMedicalDocumentActions = ({ onDeleteComplete }: UseMedicalDocumentActionsProps) => {
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      // Pour les fichiers audio ou autres formats prévisualisables, afficher dans une boîte de dialogue
      if (filePath.includes('audio') || 
          filePath.includes('pdf') || 
          filePath.includes('image') ||
          filePath.endsWith('.jpg') || 
          filePath.endsWith('.jpeg') || 
          filePath.endsWith('.png') || 
          filePath.endsWith('.pdf')) {
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
      link.download = fileName;
      link.target = '_blank';
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

  const handlePrint = (filePath: string, fileType: string = "application/pdf") => {
    try {
      // Vérifier si c'est un fichier audio
      if (filePath.includes('audio') || (fileType && fileType.includes('audio'))) {
        toast({
          title: "Information",
          description: "L'impression n'est pas disponible pour les fichiers audio."
        });
        return;
      }

      // Pour les images et PDFs, utiliser la prévisualisation pour une meilleure expérience d'impression
      if ((fileType && fileType.includes('image')) || 
          (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png')) ||
          (fileType && fileType.includes('pdf')) || 
          filePath.endsWith('.pdf')) {
        setPreviewDocument(filePath);
        return;
      }

      // Création d'une iframe invisible pour l'impression
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Si c'est une image, on l'enveloppe dans du HTML pour une meilleure impression
      if (fileType && fileType.includes('image')) {
        const doc = iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Impression document</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; }
                img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${filePath}" />
            </body>
            </html>
          `);
          doc.close();
          
          iframe.onload = () => {
            try {
              iframe.contentWindow?.print();
              setTimeout(() => {
                document.body.removeChild(iframe);
              }, 1000);
            } catch (err) {
              console.error("Erreur lors de l'impression:", err);
              document.body.removeChild(iframe);
            }
          };
          return;
        }
      }

      // Pour les PDF et autres documents
      const printWindow = window.open(filePath, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', function() {
          try {
            setTimeout(() => {
              printWindow.print();
            }, 1000);
          } catch (err) {
            console.error("Erreur lors de l'impression:", err);
          }
        });
      } else {
        throw new Error("Impossible d'ouvrir une nouvelle fenêtre pour l'impression.");
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
    // Cette fonction sera appelée par le DocumentCard
    console.log("Partage du document:", documentId);
    toast({
      title: "Fonctionnalité en développement",
      description: "Le partage de document sera bientôt disponible. Pour envoyer un email, veuillez utiliser la fonction de partage de votre navigateur."
    });
  };
  
  const handleView = (filePath: string, fileType: string = "application/pdf") => {
    // Pour tous les types de fichiers, utiliser la prévisualisation
    try {
      console.log("Visualisation du document:", filePath, fileType);
      
      // Utiliser le dialogue de prévisualisation pour tous les types de fichiers
      setPreviewDocument(filePath);
    } catch (error) {
      console.error("Erreur lors de l'ouverture du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document",
        variant: "destructive"
      });
    }
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

  const handleVisibilityChange = async (documentId: string, isPrivate: boolean) => {
    // Pour cette démonstration, nous gérons la visibilité uniquement côté client
    // dans une application réelle, nous mettrions à jour la base de données
    console.log(`Document ${documentId} est maintenant ${isPrivate ? 'privé' : 'visible avec code'}`);
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
    handleDelete,
    handleVisibilityChange
  };
};
