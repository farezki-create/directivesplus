
import { useEffect, useState } from "react";
import { Document } from "@/components/documents/types";
import { DocumentsList } from "./DocumentsList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DocumentListProps {
  userId: string;
  restrictedAccess?: {
    isFullAccess: boolean;
    allowedDocumentId?: string;
    documents?: Document[];
  };
  initialDocuments?: Document[];
}

export function DocumentList({ userId, restrictedAccess, initialDocuments }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments || []);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [sharingCode, setSharingCode] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();
  
  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents.",
        variant: "destructive",
      });
      return;
    }
    
    setDocuments(data || []);
  };
  
  useEffect(() => {
    if (userId && !initialDocuments) {
      fetchDocuments();
    }
  }, [userId, initialDocuments]);

  const handleDocumentPreview = async (doc: Document) => {
    try {
      console.log("Preview document:", doc);
      let fileUrl;
      
      // Check if the file_path is already a signed URL
      if (doc.file_path.startsWith('http')) {
        fileUrl = doc.file_path;
      } else {
        const bucketName = doc.file_path.includes('/') 
          ? 'directives_pdfs' 
          : 'directives_pdfs';
          
        const path = doc.file_path.includes('/') 
          ? doc.file_path 
          : `${userId}/${doc.file_path}`;
          
        console.log("Fetching signed URL for:", path, "from bucket:", bucketName);
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(path, 3600);
          
        if (error) {
          console.error("Error creating signed URL:", error);
          throw new Error("Impossible de récupérer l'URL du document");
        }
        
        fileUrl = data.signedUrl;
      }
      
      if (!fileUrl) {
        throw new Error("Impossible de récupérer l'URL du document");
      }
      
      console.log("Document URL:", fileUrl);
      setPreviewUrl(fileUrl);
      setSelectedDocumentId(doc.id);
      setSharingCode(null);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error getting document preview URL:", error);
      toast({
        title: "Erreur",
        description: "Impossible de prévisualiser le document",
        variant: "destructive",
      });
    }
  };
  
  const handleDocumentDelete = (documentId: string) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
    // Close preview if the deleted document was being previewed
    if (selectedDocumentId === documentId) {
      setSelectedDocumentId(null);
      setPreviewUrl(null);
      setIsPreviewOpen(false);
    }
  };

  return (
    <DocumentsList 
      documents={documents}
      onPreview={handleDocumentPreview}
      selectedDocumentId={selectedDocumentId}
      sharingCode={sharingCode}
      previewUrl={previewUrl}
      isPreviewOpen={isPreviewOpen}
      setIsPreviewOpen={setIsPreviewOpen}
      onDelete={handleDocumentDelete}
      restrictedAccess={restrictedAccess}
    />
  );
}
