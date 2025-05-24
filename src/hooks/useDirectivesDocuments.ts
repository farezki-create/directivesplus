
import { useState, useEffect } from "react";
import { useDossierDocuments } from "@/hooks/directives/useDossierDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { useDocumentOperations } from "@/hooks/useDocumentOperations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/types/documents";

export type { Document } from "@/types/documents";

export const useDirectivesDocuments = () => {
  const { user, isAuthenticated } = useAuth();
  const { documents: dossierDocuments, isLoading: dossierLoading } = useDossierDocuments();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);

  // Use the document operations hook for all document actions
  const {
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    handleDelete: handleDeleteOperation,
    confirmDelete
  } = useDocumentOperations(() => {
    // Refresh documents after operations
    if (isAuthenticated && user?.id) {
      loadUserDocuments();
    }
  });

  const loadUserDocuments = async () => {
    if (!isAuthenticated || !user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des documents:", error);
        setDocuments([]);
      } else {
        const transformedDocuments: Document[] = (data || []).map(doc => ({
          ...doc,
          file_type: doc.content_type || 'pdf'
        }));
        setDocuments(transformedDocuments);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUserDocuments();
    } else if (dossierDocuments.length > 0) {
      setDocuments(dossierDocuments);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, dossierDocuments]);

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      const { error } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', documentToDelete);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete));
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  const handleUploadComplete = () => {
    if (isAuthenticated && user?.id) {
      loadUserDocuments();
    }
  };

  const handlePreviewDownload = (filePath: string) => {
    const document = documents.find(doc => doc.file_path === filePath);
    if (document) {
      handleDownload(document, document.file_name);
    }
  };

  const handlePreviewPrint = (filePath: string) => {
    const document = documents.find(doc => doc.file_path === filePath);
    if (document) {
      handlePrint(document);
    }
  };

  return {
    user,
    isAuthenticated,
    documents,
    isLoading: isLoading || dossierLoading,
    showAddOptions,
    setShowAddOptions,
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload: (filePath: string, fileName: string) => {
      const document = documents.find(doc => doc.file_path === filePath);
      if (document) {
        handleDownload(document, fileName);
      }
    },
    handlePrint: (filePath: string, contentType?: string) => {
      const document = documents.find(doc => doc.file_path === filePath);
      if (document) {
        handlePrint(document, contentType);
      }
    },
    handleView: (filePath: string, contentType?: string) => {
      const document = documents.find(doc => doc.file_path === filePath);
      if (document) {
        handleView(document, contentType);
      }
    },
    handleDelete,
    confirmDelete,
    handleUploadComplete,
    handlePreviewDownload,
    handlePreviewPrint
  };
};
