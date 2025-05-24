
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
      
      console.log("useDirectivesDocuments - Documents récupérés depuis Supabase:", data);
      
      // Combiner les documents Supabase avec ceux du dossier actif s'il y en a
      let allDocuments = data || [];
      
      if (dossierActif?.contenu?.documents) {
        const dossierDocuments = transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
        // Filtrer les doublons par ID
        const existingIds = allDocuments.map(doc => doc.id);
        const newDossierDocs = dossierDocuments.filter(doc => !existingIds.includes(doc.id));
        allDocuments = [...allDocuments, ...newDossierDocs];
      }
      
      console.log("useDirectivesDocuments - Tous les documents (Supabase + Dossier):", allDocuments);
      setDocuments(allDocuments);
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

  function transformDossierDocuments(dossierDocuments: any[], userId: string): Document[] {
    return dossierDocuments.map((doc: any) => {
      console.log("Transformation du document dossier:", doc);
      
      // Éviter les références circulaires en créant une copie propre
      let cleanContent = null;
      if (doc.content && typeof doc.content === 'object') {
        try {
          cleanContent = JSON.parse(JSON.stringify(doc.content));
        } catch (error) {
          console.warn("Impossible de sérialiser le contenu:", error);
          cleanContent = { title: doc.content.title || "Contenu indisponible" };
        }
      }
      
      const transformedDoc: Document = {
        id: doc.id,
        file_name: doc.file_name || doc.title || cleanContent?.title || 'Document transféré',
        file_path: doc.file_path || (cleanContent ? JSON.stringify(cleanContent) : ''),
        created_at: doc.created_at || new Date().toISOString(),
        description: doc.description || cleanContent?.title || 'Document transféré depuis Directives Doc',
        content_type: doc.content_type || 'application/json',
        user_id: doc.user_id || userId,
        is_private: doc.is_private || false,
        content: cleanContent
      };
      
      console.log("Document transformé:", transformedDoc);
      return transformedDoc;
    });
  }

  function loadDossierDocuments() {
    console.log("Loading documents from dossier actif:", dossierActif);
    
    if (dossierActif?.contenu?.documents) {
      const dossierDocuments = transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
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
