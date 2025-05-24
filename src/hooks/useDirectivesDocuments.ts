
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
    console.log("=== DEBUG useDirectivesDocuments - useEffect ===");
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
    console.log("=== FIN DEBUG useDirectivesDocuments - useEffect ===");
  }, [isAuthenticated, isLoading, user, dossierActif]);

  async function fetchDocuments() {
    console.log("=== DEBUG useDirectivesDocuments - fetchDocuments ===");
    console.log("useDirectivesDocuments - fetchDocuments appelé");
    if (!user) {
      console.log("useDirectivesDocuments - Pas d'utilisateur, abandon");
      return;
    }
    
    const supabaseDocuments = await fetchSupabaseDocuments(user.id);
    console.log("useDirectivesDocuments - Documents Supabase récupérés:", supabaseDocuments);
    console.log("useDirectivesDocuments - Type Supabase:", typeof supabaseDocuments);
    console.log("useDirectivesDocuments - Est un tableau Supabase:", Array.isArray(supabaseDocuments));
    
    const allDocuments = mergeDocuments(supabaseDocuments);
    console.log("useDirectivesDocuments - Tous documents après fusion:", allDocuments);
    console.log("useDirectivesDocuments - Type après fusion:", typeof allDocuments);
    console.log("useDirectivesDocuments - Est un tableau après fusion:", Array.isArray(allDocuments));
    console.log("useDirectivesDocuments - Avant setDocuments, allDocuments:", allDocuments);
    
    setDocuments(allDocuments);
    console.log("=== FIN DEBUG useDirectivesDocuments - fetchDocuments ===");
  }

  function loadDossierDocuments() {
    console.log("=== DEBUG useDirectivesDocuments - loadDossierDocuments ===");
    console.log("useDirectivesDocuments - loadDossierDocuments appelé");
    const dossierDocuments = getDossierDocuments();
    console.log("useDirectivesDocuments - Documents du dossier récupérés:", dossierDocuments);
    console.log("useDirectivesDocuments - Type des documents:", typeof dossierDocuments);
    console.log("useDirectivesDocuments - Est un tableau:", Array.isArray(dossierDocuments));
    console.log("useDirectivesDocuments - Longueur:", dossierDocuments?.length);
    console.log("useDirectivesDocuments - Avant setDocuments dans loadDossierDocuments:", dossierDocuments);
    
    setDocuments(dossierDocuments);
    
    console.log("useDirectivesDocuments - Après setDocuments, vérification de l'état:");
    // Note: cette vérification pourrait ne pas refléter l'état immédiatement à cause de l'asynchronisme de setState
    setTimeout(() => {
      console.log("useDirectivesDocuments - État documents après timeout:", documents);
    }, 100);
    
    console.log("=== FIN DEBUG useDirectivesDocuments - loadDossierDocuments ===");
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

  // Log des documents avant le retour
  console.log("=== DEBUG useDirectivesDocuments - RETOUR ===");
  console.log("useDirectivesDocuments - Documents à retourner:", documents);
  console.log("useDirectivesDocuments - Type documents à retourner:", typeof documents);
  console.log("useDirectivesDocuments - Est un tableau à retourner:", Array.isArray(documents));
  console.log("useDirectivesDocuments - Longueur à retourner:", documents?.length);

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
