
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDocumentOperations } from "@/hooks/useDocumentOperations";
import { useSupabaseDocuments } from "@/hooks/directives/useSupabaseDocuments";
import { useDossierDocuments } from "@/hooks/directives/useDossierDocuments";
import { downloadDocument, printDocument } from "@/utils/document-operations";

// Keep the existing Document interface here for backward compatibility
export interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description: string;
  content_type: string;
  file_type?: string;
  user_id: string;
  is_private?: boolean;
  content?: any;
  external_id: string | null;
  file_size: number | null;
  updated_at: string;
}

export const useDirectivesDocuments = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showAddOptions, setShowAddOptions] = useState(false);

  const { fetchSupabaseDocuments, loading: supabaseLoading } = useSupabaseDocuments();
  const { getDossierDocuments, mergeDocuments, dossierActif } = useDossierDocuments();

  // Memoize la fonction fetchDocuments pour éviter les recréations
  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    
    const supabaseDocuments = await fetchSupabaseDocuments(user.id);
    const allDocuments = mergeDocuments(supabaseDocuments);
    setDocuments(allDocuments);
  }, [user, fetchSupabaseDocuments, mergeDocuments]);

  // Memoize la fonction loadDossierDocuments
  const loadDossierDocuments = useCallback(() => {
    const dossierDocuments = getDossierDocuments();
    setDocuments(dossierDocuments);
  }, [getDossierDocuments]);

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

  // Optimiser les effets avec des dépendances plus précises
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      fetchDocuments();
    } else if (!isAuthenticated && !isLoading && dossierActif) {
      loadDossierDocuments();
    }
  }, [isAuthenticated, isLoading, user?.id, dossierActif?.id, fetchDocuments, loadDossierDocuments]);

  const handleUploadComplete = useCallback(() => {
    if (isAuthenticated && user) {
      fetchDocuments();
    } else {
      loadDossierDocuments();
    }
  }, [isAuthenticated, user, fetchDocuments, loadDossierDocuments]);

  const handlePreviewDownload = useCallback((filePath: string) => {
    const fileName = filePath.split('/').pop() || 'document';
    downloadDocument(filePath);
  }, []);

  const handlePreviewPrint = useCallback((filePath: string) => {
    console.log("handlePreviewPrint appelé pour:", filePath);
    printDocument(filePath);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || supabaseLoading,
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
