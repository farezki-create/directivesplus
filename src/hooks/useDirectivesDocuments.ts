
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { detectFileType } from "@/utils/documentUtils";
import { downloadDocument, printDocument } from "@/utils/document-operations";
import { useDocumentOperations } from "@/hooks/useDocumentOperations";

export interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  file_type?: string;
  user_id: string;
  is_private?: boolean;
}

export const useDirectivesDocuments = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);

  // Use the combined document operations hook
  const {
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    confirmDelete,
    handleDelete
  } = useDocumentOperations(fetchDocuments);

  useEffect(() => {
    // SUPPRESSION de la redirection automatique vers /auth
    // Ce hook peut être utilisé dans des contextes publics
    if (isAuthenticated && user && !isLoading) {
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, user]);

  async function fetchDocuments() {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log("useDirectivesDocuments - Documents récupérés:", data);
      setDocuments(data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const handleUploadComplete = () => {
    fetchDocuments();
  };

  const handlePreviewDownload = (filePath: string) => {
    const fileName = filePath.split('/').pop() || 'document';
    downloadDocument(filePath);
  };

  const handlePreviewPrint = (filePath: string) => {
    console.log("handlePreviewPrint appelé pour:", filePath);
    printDocument(filePath);
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loading,
    documents,
    showAddOptions,
    setShowAddOptions,
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    confirmDelete,
    handleDelete,
    handleUploadComplete,
    handlePreviewDownload,
    handlePreviewPrint
  };
};
