
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { useDocumentViewer } from "./useDocumentViewer";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentPrint } from "./useDocumentPrint";
import { useDocumentDeletion } from "./useDocumentDeletion";
import { ShareableDocument } from "@/types/sharing";

interface Document extends ShareableDocument {
  // Hérite de ShareableDocument pour compatibilité complète
}

export const useMedicalDocuments = (user: User | null) => {
  const [documents, setDocuments] = useState<ShareableDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Document handling hooks
  const { handleView: handleViewDocument } = useDocumentViewer();
  const { handleDownload: handleDownloadDocument } = useDocumentDownload();
  const { handlePrint: handlePrintDocument } = useDocumentPrint();
  const { 
    documentToDelete,
    setDocumentToDelete,
    confirmDelete,
    handleDelete 
  } = useDocumentDeletion({ 
    onDeleteComplete: () => fetchDocuments(),
    tableName: "medical_documents"
  });

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching medical documents for user:", user.id);
      
      const { data, error: fetchError } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error("Error fetching documents:", fetchError);
        setError(fetchError.message);
        throw fetchError;
      }
      
      console.log("Retrieved documents:", data?.length || 0);
      
      // Transformer en ShareableDocument
      const processedDocuments: ShareableDocument[] = (data || []).map(doc => ({
        ...doc,
        file_type: 'medical' as const,
        source: 'medical_documents' as const,
        is_private: false // Default value since it's not stored in DB
      }));
      
      setDocuments(processedDocuments);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des documents:", error);
      setError(error.message || "Impossible de charger vos documents médicaux");
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents médicaux",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    confirmDelete(documentId);
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const handleUploadComplete = (url: string, fileName: string, isPrivate: boolean) => {
    console.log("Document upload complete, refreshing list...");
    fetchDocuments();
    toast({
      title: "Document téléchargé",
      description: "Votre document a été importé avec succès" + (isPrivate ? " (privé)" : " (visible avec code)")
    });
  };

  // Use refreshDocuments as an alias for fetchDocuments for API consistency
  const refreshDocuments = fetchDocuments;

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    refreshDocuments,
    handleUploadComplete,
    handleViewDocument,
    handleDownloadDocument,
    handlePrintDocument,
    handleDeleteDocument,
    documentToDelete,
    setDocumentToDelete,
    confirmDelete
  };
};
