import { useState, useEffect } from "react";
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
    console.log("useDirectivesDocuments - useEffect déclenché");
    console.log("useDirectivesDocuments - isAuthenticated:", isAuthenticated);
    console.log("useDirectivesDocuments - isLoading:", isLoading);
    console.log("useDirectivesDocuments - user:", user);
    console.log("useDirectivesDocuments - dossierActif:", dossierActif);
    
    if (isAuthenticated && user && !isLoading) {
      console.log("useDirectivesDocuments - Utilisateur authentifié, récupération documents");
      fetchDocuments();
    } else if (!isAuthenticated && !isLoading) {
      console.log("useDirectivesDocuments - Utilisateur non connecté, chargement documents dossier");
      // Pour les utilisateurs non connectés, utiliser les documents du dossier actif
      loadDossierDocuments();
    }
  }, [isAuthenticated, isLoading, user, dossierActif]);

  async function fetchDocuments() {
    console.log("useDirectivesDocuments - fetchDocuments appelé");
    if (!user) {
      console.log("useDirectivesDocuments - Pas d'utilisateur, abandon");
      return;
    }
    
    const supabaseDocuments = await fetchSupabaseDocuments(user.id);
    console.log("useDirectivesDocuments - Documents Supabase récupérés:", supabaseDocuments);
    const allDocuments = mergeDocuments(supabaseDocuments);
    console.log("useDirectivesDocuments - Tous documents après fusion:", allDocuments);
    setDocuments(allDocuments);
  }

  function loadDossierDocuments() {
    console.log("useDirectivesDocuments - loadDossierDocuments appelé");
    const dossierDocuments = getDossierDocuments();
    console.log("useDirectivesDocuments - Documents du dossier récupérés:", dossierDocuments);
    console.log("useDirectivesDocuments - Type des documents:", typeof dossierDocuments);
    console.log("useDirectivesDocuments - Est un tableau:", Array.isArray(dossierDocuments));
    setDocuments(dossierDocuments);
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
