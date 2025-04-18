
import { useEffect, useState } from "react";
import { Document } from "@/components/documents/types";
import { DocumentsList } from "./DocumentsList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DocumentListProps {
  userId: string;
}

export function DocumentList({ userId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [sharingCode, setSharingCode] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
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
    
    if (userId) {
      fetchDocuments();
    }
  }, [userId, toast]);

  const handleDocumentPreview = (doc: Document) => {
    setSelectedDocumentId(doc.id);
    setSharingCode(null);
  };

  return (
    <DocumentsList 
      documents={documents}
      onPreview={handleDocumentPreview}
      selectedDocumentId={selectedDocumentId}
      sharingCode={sharingCode}
    />
  );
}
