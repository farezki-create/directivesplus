
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { detectFileType } from "@/utils/documentUtils";
import { downloadDocument, printDocument } from "@/utils/document-operations";
import { useDocumentOperations } from "@/hooks/useDocumentOperations";
import { useDossierStore } from "@/store/dossierStore";

export interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  file_type?: string;
  user_id?: string;
  is_private?: boolean;
  content?: any;
}

export const useDirectivesDocuments = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { dossierActif } = useDossierStore();
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
    if (isAuthenticated && user && !isLoading) {
      fetchDocuments();
    } else if (!isAuthenticated && !isLoading) {
      // Pour les utilisateurs non connectés, utiliser les documents du dossier actif
      loadDossierDocuments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, user, dossierActif]);

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

  function loadDossierDocuments() {
    console.log("Loading documents from dossier actif:", dossierActif);
    
    if (dossierActif?.contenu?.documents) {
      // Transformer les documents du dossier en format compatible
      const dossierDocuments = dossierActif.contenu.documents.map((doc: any) => ({
        id: doc.id,
        file_name: doc.file_name || doc.title || 'Document sans nom',
        file_path: doc.file_path || doc.content || '',
        created_at: doc.created_at || new Date().toISOString(),
        description: doc.description || doc.content?.title || 'Document transféré',
        content_type: doc.content_type || 'application/pdf',
        user_id: doc.user_id || dossierActif.userId,
        is_private: doc.is_private || false,
        content: doc.content || doc.original_directive
      }));
      
      console.log("Documents loaded from dossier:", dossierDocuments);
      setDocuments(dossierDocuments);
    } else {
      console.log("No documents in dossier actif");
      setDocuments([]);
    }
    setLoading(false);
  }

  const handleUploadComplete = () => {
    if (isAuthenticated && user) {
      fetchDocuments();
    } else {
      loadDossierDocuments();
    }
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
