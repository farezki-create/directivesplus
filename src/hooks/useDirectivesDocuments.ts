
import { useState, useEffect } from "react";
import { useDossierDocuments } from "@/hooks/directives/useDossierDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/types/documents";

export const useDirectivesDocuments = () => {
  const { user, isAuthenticated } = useAuth();
  const { documents: dossierDocuments, isLoading: dossierLoading } = useDossierDocuments();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  // Charger les documents depuis Supabase pour les utilisateurs authentifiés
  useEffect(() => {
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
          setDocuments(data || []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des documents:", error);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };

    const loadDossierDocuments = () => {
      if (!isAuthenticated && dossierDocuments.length > 0) {
        setDocuments(dossierDocuments);
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadUserDocuments();
    } else {
      loadDossierDocuments();
    }
  }, [isAuthenticated, user, dossierDocuments]);

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdf-storage')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive"
      });
    }
  };

  const handlePrint = async (filePath: string, contentType?: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdf-storage')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le fichier",
        variant: "destructive"
      });
    }
  };

  const handleView = (filePath: string, contentType?: string) => {
    setPreviewDocument(filePath);
  };

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

  const confirmDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
  };

  const handleUploadComplete = () => {
    if (isAuthenticated && user?.id) {
      // Recharger les documents
      window.location.reload();
    }
  };

  const handlePreviewDownload = (filePath: string) => {
    const document = documents.find(doc => doc.file_path === filePath);
    if (document) {
      handleDownload(filePath, document.file_name);
    }
  };

  const handlePreviewPrint = (filePath: string) => {
    handlePrint(filePath);
  };

  return {
    documents,
    isLoading: isLoading || dossierLoading,
    showAddOptions,
    setShowAddOptions,
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    handleDelete,
    confirmDelete,
    handleUploadComplete,
    handlePreviewDownload,
    handlePreviewPrint
  };
};
