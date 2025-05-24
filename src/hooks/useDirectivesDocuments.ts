
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Document } from "@/types/documents";

// Export the Document type for use in other components
export type { Document } from "@/types/documents";

export const useDirectivesDocuments = () => {
  const { user, isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  // Load documents
  const loadDocuments = async () => {
    if (!user?.id) {
      console.log("useDirectivesDocuments - Pas d'utilisateur connecté");
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    console.log("useDirectivesDocuments - Chargement des documents pour user:", user.id);

    try {
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading documents:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents",
          variant: "destructive"
        });
        setDocuments([]);
        return;
      }

      console.log("useDirectivesDocuments - Documents chargés:", data);

      // Transform data to match Document interface
      const transformedDocuments: Document[] = (data || []).map(doc => {
        const transformedDoc: Document = {
          id: doc.id,
          file_name: doc.file_name,
          file_path: doc.file_path,
          file_type: doc.content_type || 'application/pdf',
          content_type: doc.content_type,
          user_id: doc.user_id,
          created_at: doc.created_at,
          description: doc.description,
          file_size: doc.file_size,
          updated_at: doc.updated_at,
          external_id: doc.external_id
        };
        
        console.log("useDirectivesDocuments - Document transformé:", transformedDoc);
        return transformedDoc;
      });

      setDocuments(transformedDocuments);
      console.log("useDirectivesDocuments - Total documents:", transformedDocuments.length);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [user?.id]);

  const handleUploadComplete = () => {
    loadDocuments();
    setShowAddOptions(false);
    toast({
      title: "Document ajouté",
      description: "Votre document a été ajouté avec succès",
    });
  };

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      console.log("useDirectivesDocuments - handleDownload:", filePath, fileName);
      
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement commencé",
        description: `${fileName} est en cours de téléchargement`,
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (filePath: string, fileType?: string) => {
    console.log("useDirectivesDocuments - handlePrint:", filePath, fileType);
    
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez que les popups sont autorisés.",
        variant: "destructive"
      });
    }
  };

  const handleView = (filePath: string, fileType?: string) => {
    console.log("useDirectivesDocuments - handleView:", filePath, fileType);
    
    // Pour les PDFs et autres documents, ouvrir dans un nouvel onglet
    window.open(filePath, '_blank');
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le document",
          variant: "destructive"
        });
        return;
      }

      await loadDocuments();
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    isAuthenticated,
    documents,
    isLoading,
    showAddOptions,
    setShowAddOptions,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    handleDelete,
    handleUploadComplete
  };
};
