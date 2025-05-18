
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
      console.log("Téléchargement du fichier:", filePath);
      
      // Pour les fichiers audio, afficher dans une boîte de dialogue
      if (filePath.includes('audio')) {
        setPreviewDocument(filePath);
        return;
      }
      
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName; // Spécifier le nom du fichier pour téléchargement
      link.target = "_blank"; // Assurer que le téléchargement s'ouvre dans un nouvel onglet
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement initié",
        description: "Votre document est en cours de téléchargement"
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
      console.log("Impression du fichier:", filePath, "type:", fileType);
      
      // Vérifier si c'est un fichier audio
      if (filePath.includes('audio') || (fileType && fileType.includes('audio'))) {
        toast({
          title: "Information",
          description: "L'impression n'est pas disponible pour les fichiers audio."
        });
        return;
      }
      
      // Optimisation pour impression d'images
      if (fileType && fileType.includes('image') || 
          filePath.includes('image') || 
          filePath.endsWith('.jpg') || 
          filePath.endsWith('.png') || 
          filePath.endsWith('.jpeg')) {
          
        // Créer une nouvelle fenêtre pour impression optimisée
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Impression d'image</title>
                <style>
                  body { 
                    margin: 0; 
                    display: flex; 
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                  }
                  img { max-width: 100%; max-height: 90vh; object-fit: contain; }
                </style>
              </head>
              <body>
                <img src="${filePath}" alt="Document à imprimer" />
                <script>
                  // Attendre le chargement complet de l'image
                  window.onload = function() {
                    setTimeout(function() {
                      window.print();
                      // Fermer la fenêtre après l'impression (peut être bloqué par le navigateur)
                      setTimeout(function() { window.close(); }, 500);
                    }, 500);
                  }
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          return;
        }
      }
      
      // Pour les PDF, ouvrir directement pour impression
      const printWindow = window.open(filePath, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', function() {
          try {
            setTimeout(() => {
              printWindow.print();
            }, 1000); // Délai pour s'assurer que le contenu est chargé
          } catch (err) {
            console.error("Erreur lors de l'impression:", err);
            toast({
              title: "Erreur",
              description: "Problème lors de l'impression, essayez d'utiliser le bouton d'impression du navigateur",
              variant: "destructive"
            });
          }
        });
      } else {
        throw new Error("Impossible d'ouvrir une nouvelle fenêtre. Vérifiez que les popups sont autorisés.");
      }
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document. Vérifiez que les popups sont autorisés.",
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
    try {
      console.log("Visualisation du fichier:", filePath, "type:", fileType);
      
      // Pour tous les types de fichiers supportés, utiliser la prévisualisation
      if (
        // Audio
        filePath.includes('audio') || (fileType && fileType.includes('audio')) ||
        // Images
        fileType && fileType.includes('image') || 
        filePath.includes('image') || 
        filePath.endsWith('.jpg') || 
        filePath.endsWith('.png') || 
        filePath.endsWith('.jpeg') ||
        // PDF
        fileType && fileType.includes('pdf') || 
        filePath.includes('pdf') || 
        filePath.endsWith('.pdf')
      ) {
        setPreviewDocument(filePath);
        return;
      }
      
      // Pour les autres types de documents, ouvrir dans un nouvel onglet
      const viewWindow = window.open(filePath, '_blank');
      if (!viewWindow) {
        throw new Error("Impossible d'ouvrir une nouvelle fenêtre. Vérifiez que les popups sont autorisés.");
      }
    } catch (error) {
      console.error("Erreur lors de l'affichage du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'afficher le document. Vérifiez que les popups sont autorisés.",
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
