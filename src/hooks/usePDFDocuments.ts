
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PDFDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  public_url: string;
}

export const usePDFDocuments = (userId: string | null) => {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!userId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer tous les documents de l'utilisateur
      const { data, error: fetchError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Ajouter les URLs publiques pour chaque document
      const docsWithUrls = await Promise.all(
        data.map(async (doc) => {
          const { data: urlData } = supabase.storage
            .from('pdf_documents')
            .getPublicUrl(doc.file_path);

          return {
            ...doc,
            public_url: urlData.publicUrl
          };
        })
      );

      setDocuments(docsWithUrls);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des documents:', err);
      setError(err.message || 'Erreur lors de la récupération des documents');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos documents PDF.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, description?: string) => {
    if (!userId) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour télécharger un document.',
        variant: 'destructive',
      });
      return null;
    }

    if (!file.type.includes('pdf')) {
      toast({
        title: 'Erreur',
        description: 'Seuls les fichiers PDF sont acceptés.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch(`${window.location.origin}/functions/v1/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du téléchargement');
      }

      const result = await response.json();

      toast({
        title: 'Succès',
        description: 'Document PDF téléchargé avec succès.',
      });

      // Rafraîchir la liste des documents
      await fetchDocuments();
      
      return result;
    } catch (err: any) {
      console.error('Erreur lors du téléchargement:', err);
      toast({
        title: 'Erreur',
        description: err.message || 'Erreur lors du téléchargement du document',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteDocument = async (docId: string, filePath: string) => {
    if (!userId) return false;

    try {
      // Supprimer le fichier du stockage
      const { error: storageError } = await supabase.storage
        .from('pdf_documents')
        .remove([filePath]);

      if (storageError) {
        throw storageError;
      }

      // Supprimer l'entrée de la base de données
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', docId);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: 'Succès',
        description: 'Document supprimé avec succès.',
      });

      // Rafraîchir la liste des documents
      await fetchDocuments();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      toast({
        title: 'Erreur',
        description: err.message || 'Erreur lors de la suppression du document',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments
  };
};
