
import { useEffect, useState } from "react";
import { Document } from "@/components/documents/types";
import { DocumentsList } from "./DocumentsList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DocumentListProps {
  userId: string;
  initialDocuments?: Document[];
}

export function DocumentList({ userId, initialDocuments }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments || []);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      console.log("[DocumentList] Fetching documents for user:", userId);
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("[DocumentList] Error fetching documents:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos documents.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("[DocumentList] Documents fetched:", data ? data.length : 0);
      setDocuments(data || []);
    } catch (error) {
      console.error("[DocumentList] Exception in fetchDocuments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId && !initialDocuments) {
      fetchDocuments();
    }
  }, [userId, initialDocuments]);

  const handleDocumentPreview = async (doc: Document) => {
    try {
      console.log("[DocumentList] Preview document:", doc);
      let fileUrl;
      
      if (doc.file_path.startsWith('http')) {
        fileUrl = doc.file_path;
      } else {
        const bucketName = 'directives_pdfs';
        const path = doc.file_path.includes('/') 
          ? doc.file_path 
          : `${userId}/${doc.file_path}`;
          
        console.log("[DocumentList] Fetching signed URL for:", path, "from bucket:", bucketName);
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(path, 3600);
          
        if (error) {
          console.error("[DocumentList] Error creating signed URL:", error);
          throw new Error("Impossible de récupérer l'URL du document");
        }
        
        fileUrl = data.signedUrl;
      }
      
      if (!fileUrl) {
        throw new Error("Impossible de récupérer l'URL du document");
      }
      
      console.log("[DocumentList] Document URL:", fileUrl);
      setPreviewUrl(fileUrl);
      setSelectedDocumentId(doc.id);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("[DocumentList] Error getting document preview URL:", error);
      toast({
        title: "Erreur",
        description: "Impossible de prévisualiser le document",
        variant: "destructive",
      });
    }
  };
  
  const handleDocumentDelete = async (documentId: string) => {
    try {
      const documentToDelete = documents.find(doc => doc.id === documentId);
      if (!documentToDelete) return;
      
      // Delete file from storage
      if (documentToDelete.file_path) {
        const { error: storageError } = await supabase.storage
          .from('directives_pdfs')
          .remove([documentToDelete.file_path]);
          
        if (storageError) {
          console.error("[DocumentList] Error deleting file from storage:", storageError);
        }
      }
      
      // Delete record from database
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', documentId);
        
      if (dbError) {
        console.error("[DocumentList] Error deleting document record:", dbError);
        throw dbError;
      }
      
      // Update state
      setDocuments(documents.filter(doc => doc.id !== documentId));
      if (selectedDocumentId === documentId) {
        setSelectedDocumentId(null);
        setPreviewUrl(null);
        setIsPreviewOpen(false);
      }
      
      toast({
        title: "Succès",
        description: "Document supprimé avec succès",
      });
    } catch (error) {
      console.error("[DocumentList] Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Chargement de vos documents...</div>;
  }

  return (
    <DocumentsList 
      documents={documents}
      onPreview={handleDocumentPreview}
      selectedDocumentId={selectedDocumentId}
      previewUrl={previewUrl}
      isPreviewOpen={isPreviewOpen}
      setIsPreviewOpen={setIsPreviewOpen}
      onDelete={handleDocumentDelete}
    />
  );
}
