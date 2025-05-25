
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStableAuth } from "@/contexts/StableAuthContext";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/types/documents";

export const useDirectivesDocumentsStable = () => {
  const { user } = useStableAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
  // Utiliser une ref pour éviter les rechargements répétitifs
  const lastUserIdRef = useRef<string | null>(null);
  const loadingRef = useRef<boolean>(false);

  const loadDocuments = async (userId: string) => {
    // Éviter les chargements en parallèle
    if (loadingRef.current || lastUserIdRef.current === userId) {
      return;
    }

    loadingRef.current = true;
    lastUserIdRef.current = userId;

    try {
      console.log("useDirectivesDocumentsStable - Chargement des documents pour user:", userId);
      
      const { data: pdfData, error: pdfError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (pdfError) {
        console.error("Erreur lors du chargement des documents PDF:", pdfError);
        setDocuments([]);
        return;
      }

      const transformedDocuments: Document[] = (pdfData || []).map(doc => ({
        id: doc.id,
        file_name: doc.file_name,
        file_path: doc.file_path,
        file_type: doc.content_type || 'application/pdf',
        content_type: doc.content_type || 'application/pdf',
        user_id: doc.user_id || '',
        created_at: doc.created_at || '',
        description: doc.description,
        file_size: doc.file_size,
        updated_at: doc.updated_at,
        external_id: doc.external_id
      }));

      console.log("useDirectivesDocumentsStable - Documents chargés:", transformedDocuments.length);
      setDocuments(transformedDocuments);
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
      setDocuments([]);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      loadDocuments(user.id);
    } else {
      console.log("useDirectivesDocumentsStable - Pas d'utilisateur connecté");
      setDocuments([]);
      setIsLoading(false);
      lastUserIdRef.current = null;
    }
  }, [user?.id]);

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      console.log("Téléchargement du document:", fileName);
      
      if (filePath.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Téléchargement commencé",
          description: `${fileName} est en cours de téléchargement`,
        });
      } else {
        window.open(filePath, '_blank');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (filePath: string, contentType?: string) => {
    try {
      console.log("Impression du document:", filePath);
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Impression du document</title></head>
            <body style="margin:0;">
              <iframe src="${filePath}" width="100%" height="100%" frameborder="0" onload="window.print();"></iframe>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document",
        variant: "destructive"
      });
    }
  };

  const handleView = (filePath: string, contentType?: string) => {
    try {
      console.log("Affichage du document:", filePath);
      window.open(filePath, '_blank');
    } catch (error) {
      console.error('Erreur lors de l\'affichage:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'afficher le document",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      console.log("Suppression du document:", documentId);
      
      const { error } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setDocumentToDelete(null);
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  const handleUploadComplete = () => {
    if (user?.id) {
      // Forcer le rechargement des documents
      lastUserIdRef.current = null;
      loadDocuments(user.id);
    }
  };

  return {
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
